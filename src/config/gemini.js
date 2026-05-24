/**
 * Gemini AI Configuration — Direct REST API
 * Uses fetch() instead of the SDK to avoid v1beta endpoint issues
 * Supports automatic model fallback: gemini-2.0-flash-lite → gemini-2.0-flash → gemini-1.5-flash
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Models to try in order — 2.5-flash has free tier without billing in 2026
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
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
 * Call Gemini API directly via REST — tries v1beta then v1
 */
async function callGemini(prompt, inlineData = null) {
  if (!isGeminiConfigured()) return null

  const contents = [{
    parts: inlineData
      ? [{ text: prompt }, inlineData]
      : [{ text: prompt }]
  }]

  const body = JSON.stringify({
    contents,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 2048,
    }
  })

  // Try each model with both API versions
  for (const model of MODELS) {
    for (const apiVersion of ['v1beta', 'v1']) {
      const url = `${BASE_URL}/${apiVersion}/models/${model}:generateContent?key=${API_KEY}`

      try {
        console.log(`[Veritas AI] Trying ${apiVersion}/${model}...`)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData?.error?.message || `HTTP ${response.status}`
          
          // If quota exceeded or model not found, try next
          if (response.status === 429 || response.status === 404 || response.status === 400) {
            console.warn(`[Veritas AI] ${apiVersion}/${model}: ${errorMsg}`)
            continue
          }
          throw new Error(errorMsg)
        }

        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
          console.warn(`[Veritas AI] ${apiVersion}/${model}: Empty response`)
          continue
        }

        console.log(`[Veritas AI] ✓ Success with ${apiVersion}/${model}`)
        return text

      } catch (err) {
        console.warn(`[Veritas AI] ${apiVersion}/${model} failed:`, err.message)
        continue
      }
    }
  }

  // All models failed
  console.error('[Veritas AI] All models failed. Falling back to heuristic analysis.')
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
      mimeType: file.type
    }
  }
  return await callGemini(prompt, inlineData)
}

/**
 * Analyze video frames with Gemini Vision
 */
export async function analyzeVideoWithGemini(file, prompt) {
  // For video, we extract a frame and analyze it as an image
  const frameData = await extractVideoFrame(file)
  if (!frameData) return null

  const inlineData = {
    inlineData: {
      data: frameData.base64,
      mimeType: 'image/jpeg'
    }
  }
  return await callGemini(prompt, inlineData)
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
 * Extract a frame from a video file
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
