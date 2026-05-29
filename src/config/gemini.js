/**
 * Gemini AI Configuration — Direct REST API
 * Uses fetch() instead of the SDK to avoid v1beta endpoint issues
 * Supports automatic model fallback: gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash-lite
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Models to try in order — using the generic alias models ensures we get the generous free tier limits
// This avoids strict billing quotas from specific numbered versions
const MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-2.5-flash',
]

const BASE_URL = 'https://generativelanguage.googleapis.com'

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured() {
  const configured = API_KEY && API_KEY !== 'your_gemini_api_key_here' && API_KEY.length > 10
  console.log('[Veritas AI] Gemini configured:', configured)
  return configured
}

/**
 * Call Gemini API directly via REST — smart retry with rate limit handling
 */
async function callGemini(prompt, inlineData = null) {
  if (!isGeminiConfigured()) return null

  const parts = inlineData
    ? [{ text: prompt }, inlineData]
    : [{ text: prompt }]

  const contents = [{ parts }]

  const body = JSON.stringify({
    contents,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 4096,
    }
  })

  for (const model of MODELS) {
    const url = `${BASE_URL}/v1beta/models/${model}:generateContent?key=${API_KEY}`
    
    // Try up to 2 attempts per model (1 original + 1 retry for rate limits)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) console.log(`[Veritas AI] Retry attempt ${attempt} for ${model}...`)
        else console.log(`[Veritas AI] Trying ${model}...`)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData?.error?.message || `HTTP ${response.status}`
          
          if (response.status === 429) {
            // Check if it's a daily quota (no point retrying) vs per-minute (worth waiting)
            const isDaily = errorMsg.includes('PerDay') || errorMsg.includes('limit: 0')
            
            if (isDaily && attempt === 0) {
              console.warn(`[Veritas AI] ${model}: Daily quota exhausted, trying next model`)
              break // Try next model, don't retry this one
            }
            
            // Per-minute rate limit — wait and retry once
            if (attempt === 0) {
              const waitMs = 5000
              console.warn(`[Veritas AI] ${model}: Rate limited, waiting ${waitMs/1000}s before retry...`)
              await new Promise(r => setTimeout(r, waitMs))
              continue
            }
            
            console.warn(`[Veritas AI] ${model}: Still rate limited after retry`)
            break
          }
          
          if (response.status === 404) {
            console.warn(`[Veritas AI] ${model}: Model not found`)
            break // Try next model
          }
          
          if (response.status === 400) {
            console.warn(`[Veritas AI] ${model}: Bad request — ${errorMsg.slice(0, 150)}`)
            break
          }
          
          throw new Error(errorMsg)
        }

        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
          const blockReason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || 'unknown'
          console.warn(`[Veritas AI] ${model}: Empty response (reason: ${blockReason})`)
          break
        }

        console.log(`[Veritas AI] ✓ Success with ${model}`)
        return text

      } catch (err) {
        console.warn(`[Veritas AI] ${model} failed:`, err.message)
        break
      }
    }
  }

  console.error('[Veritas AI] All models failed. Falling back to heuristic analysis.')
  return null
}

/**
 * Call Gemini with multiple inline data parts (e.g. multiple video frames)
 */
async function callGeminiMultipart(prompt, inlineDataArray = []) {
  if (!isGeminiConfigured()) return null

  const parts = [{ text: prompt }, ...inlineDataArray]
  const contents = [{ parts }]

  const body = JSON.stringify({
    contents,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 4096,
    }
  })

  console.log(`[Veritas AI] Multipart request: ${inlineDataArray.length} images, payload size: ${(body.length / 1024).toFixed(0)} KB`)

  for (const model of MODELS) {
    for (const apiVersion of ['v1beta', 'v1']) {
      const url = `${BASE_URL}/${apiVersion}/models/${model}:generateContent?key=${API_KEY}`

      try {
        console.log(`[Veritas AI] Trying ${apiVersion}/${model} (multipart)...`)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData?.error?.message || `HTTP ${response.status}`
          console.warn(`[Veritas AI] ${apiVersion}/${model} [${response.status}]: ${errorMsg}`)
          if (response.status === 429 || response.status === 404 || response.status === 400) {
            continue
          }
          throw new Error(errorMsg)
        }

        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
          const blockReason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || 'unknown'
          console.warn(`[Veritas AI] ${apiVersion}/${model}: Empty response (reason: ${blockReason})`)
          continue
        }

        console.log(`[Veritas AI] ✓ Success with ${apiVersion}/${model} (multipart)`)
        return text
      } catch (err) {
        console.warn(`[Veritas AI] ${apiVersion}/${model} multipart failed:`, err.message)
        continue
      }
    }
  }

  console.error('[Veritas AI] All models failed for multipart. Check browser console for specific error messages above.')
  return null
}

/**
 * Analyze text content with Gemini
 */
export async function analyzeTextWithGemini(text, prompt) {
  const fullPrompt = prompt.replace('{TEXT}', text)
  return await callGemini(fullPrompt)
}

/**
 * Analyze image with Gemini Vision
 */
export async function analyzeImageWithGemini(file, prompt) {
  const base64Data = await fileToBase64(file)
  const inlineData = {
    inlineData: {
      data: base64Data,
      mimeType: file.type || 'image/jpeg'
    }
  }
  return await callGemini(prompt, inlineData)
}

/**
 * Analyze image from base64 data directly
 */
export async function analyzeImageBase64WithGemini(base64Data, mimeType, prompt) {
  const inlineData = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType || 'image/jpeg'
    }
  }
  return await callGemini(prompt, inlineData)
}

/**
 * Analyze video frames with Gemini Vision — sends multiple frames
 */
export async function analyzeVideoWithGemini(file, prompt) {
  console.log(`[Veritas AI] Starting video analysis for: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB, type: ${file.type})`)

  const frames = await extractMultipleVideoFrames(file, 4)

  if (!frames || frames.length === 0) {
    console.error('[Veritas AI] ✗ Failed to extract any frames from video — falling back to single frame')

    // Fallback: try extracting a single frame with the legacy method
    const singleFrame = await extractVideoFrame(file)
    if (!singleFrame) {
      console.error('[Veritas AI] ✗ Single frame extraction also failed')
      return null
    }

    const inlineData = {
      inlineData: {
        data: singleFrame.base64,
        mimeType: 'image/jpeg'
      }
    }
    console.log('[Veritas AI] Sending single frame to Gemini...')
    return await callGemini(prompt + '\n\nNote: Only 1 frame could be extracted from this video. Analysis is based on this single frame. Be extra skeptical since temporal analysis is not possible.', inlineData)
  }

  console.log(`[Veritas AI] ✓ Got ${frames.length} frames, sending to Gemini...`)

  const inlineDataArray = frames.map(frame => ({
    inlineData: {
      data: frame.base64,
      mimeType: 'image/jpeg'
    }
  }))

  const frameTimestamps = frames.map(f => f.timestamp?.toFixed(1) + 's').join(', ')
  const enhancedPrompt = `${prompt}\n\nYou are being given ${frames.length} frames extracted at timestamps [${frameTimestamps}] from the video. CRITICALLY IMPORTANT: Compare faces across ALL frames. Look for subtle shifts in face shape, skin texture changes, boundary artifacts, or any inconsistencies between frames. These temporal artifacts are the strongest deepfake indicators. If skin looks unnaturally smooth or poreless in ANY frame, flag it as suspicious.`

  return await callGeminiMultipart(enhancedPrompt, inlineDataArray)
}

/**
 * Analyze video frames from base64 array
 */
export async function analyzeVideoFramesWithGemini(framesBase64Array, prompt) {
  if (!framesBase64Array || framesBase64Array.length === 0) return null

  const inlineDataArray = framesBase64Array.map(frame => ({
    inlineData: {
      data: frame,
      mimeType: 'image/jpeg'
    }
  }))

  const enhancedPrompt = `${prompt}\n\nNote: You are being given ${framesBase64Array.length} frames extracted from a video. Analyze all frames together.`

  return await callGeminiMultipart(enhancedPrompt, inlineDataArray)
}

/**
 * Convert File to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Extract multiple frames from a video file at different timestamps
 * Includes timeout and error handling to prevent silent failures
 */
function extractMultipleVideoFrames(file, count = 4) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    const frames = []

    // Timeout after 15 seconds — video might not be decodable
    const timeout = setTimeout(() => {
      console.warn('[Veritas AI] Video frame extraction timed out after 15s')
      URL.revokeObjectURL(url)
      resolve(frames.length > 0 ? frames : null)
    }, 15000)

    // Do NOT set crossOrigin for blob URLs — it breaks local file loading
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    video.onloadedmetadata = () => {
      console.log(`[Veritas AI] Video loaded: ${video.duration.toFixed(1)}s, ${video.videoWidth}x${video.videoHeight}`)

      if (!video.videoWidth || !video.videoHeight) {
        console.warn('[Veritas AI] Video has no dimensions — codec may not be supported')
        clearTimeout(timeout)
        URL.revokeObjectURL(url)
        resolve(null)
        return
      }

      // Scale down to max 720p to keep payload size reasonable for the API
      const MAX_HEIGHT = 720
      let canvasWidth = video.videoWidth
      let canvasHeight = video.videoHeight
      if (canvasHeight > MAX_HEIGHT) {
        const scale = MAX_HEIGHT / canvasHeight
        canvasWidth = Math.round(canvasWidth * scale)
        canvasHeight = MAX_HEIGHT
      }
      console.log(`[Veritas AI] Frame output resolution: ${canvasWidth}x${canvasHeight}`)

      const duration = video.duration
      const timestamps = []
      // Distribute frames evenly across the video (5% to 90% of duration)
      for (let i = 0; i < count; i++) {
        const position = 0.05 + (i / Math.max(count - 1, 1)) * 0.85
        timestamps.push(Math.min(duration * position, duration - 0.1))
      }

      let currentIndex = 0

      const captureFrame = () => {
        if (currentIndex >= timestamps.length) {
          clearTimeout(timeout)
          URL.revokeObjectURL(url)
          const totalSize = frames.reduce((sum, f) => sum + f.base64.length, 0)
          console.log(`[Veritas AI] ✓ Extracted ${frames.length} frames from video (total payload: ${(totalSize / 1024).toFixed(0)} KB base64)`)
          resolve(frames)
          return
        }
        video.currentTime = timestamps[currentIndex]
      }

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = canvasWidth
          canvas.height = canvasHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
          frames.push({ base64: dataUrl.split(',')[1], timestamp: timestamps[currentIndex] })
          console.log(`[Veritas AI] Captured frame ${currentIndex + 1}/${count} at ${timestamps[currentIndex].toFixed(1)}s`)
        } catch (e) {
          console.warn(`[Veritas AI] Failed to capture frame ${currentIndex + 1}:`, e.message)
        }
        currentIndex++
        captureFrame()
      }

      captureFrame()
    }

    video.onerror = (e) => {
      console.error('[Veritas AI] Video loading error:', e)
      clearTimeout(timeout)
      URL.revokeObjectURL(url)
      resolve(null)
    }

    video.src = url
    video.load()
  })
}

/**
 * Extract a single frame from a video file (legacy — used by extractVideoFrame)
 */
function extractVideoFrame(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const url = URL.createObjectURL(file)

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      URL.revokeObjectURL(url)
      resolve({ base64: dataUrl.split(',')[1] })
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }

    video.src = url
    video.load()
  })
}

// Legacy exports for backward compatibility
export function getGeminiModel() {
  return isGeminiConfigured() ? { generateContent: () => {} } : null
}
export function getGeminiVisionModel() {
  return isGeminiConfigured() ? { generateContent: () => {} } : null
}
export async function fileToGenerativePart(file) {
  const base64Data = await fileToBase64(file)
  return { inlineData: { data: base64Data, mimeType: file.type } }
}
