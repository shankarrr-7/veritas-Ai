import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScans } from '../context/ScanContext'
import { analyzeContent } from '../utils/analyzer'
import {
  ScanSearch, FileText, Image, Video, Link2,
  Upload, X, CheckCircle, Clipboard, AlertCircle
} from 'lucide-react'

const tabs = [
  { id: 'text', label: 'Text', icon: <FileText size={16} /> },
  { id: 'image', label: 'Image', icon: <Image size={16} /> },
  { id: 'video', label: 'Video', icon: <Video size={16} /> },
  { id: 'url', label: 'URL', icon: <Link2 size={16} /> },
]

export default function Analyze() {
  const [activeTab, setActiveTab] = useState('text')
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState({ progress: 0, message: '' })
  const { addScan } = useScans()
  const navigate = useNavigate()

  const handleAnalyze = async (type, data) => {
    setScanning(true)
    setScanProgress({ progress: 0, message: 'Initializing...' })

    try {
      const result = await analyzeContent(type, data, (progress) => {
        setScanProgress(progress)
      })

      const scan = addScan({
        type,
        input: typeof data === 'string' ? data.slice(0, 200) : (data?.name || 'file'),
        result
      })

      setScanning(false)
      navigate(`/results/${scan.id}`)
    } catch (error) {
      setScanning(false)
      console.error('Analysis failed:', error)
    }
  }

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }} className="min-h-screen">
      <AnimatePresence>
        {scanning && <ScanningOverlay progress={scanProgress.progress} message={scanProgress.message} />}
      </AnimatePresence>

      <div className="page-container" style={{ maxWidth: '768px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center" style={{ marginBottom: '48px' }}
        >
          <h1 className="font-bold" style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '14px',
            fontSize: 'clamp(1.5rem, 5vw, 2.25rem)'
          }}>
            Analyze <span className="gradient-text">Content</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto' }}>
            Paste text, upload files, or enter a URL to detect AI-generated content.
          </p>
        </motion.div>

        {/* Tabs - scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card flex items-center mx-auto w-fit analyze-tabs-container"
          style={{ padding: '6px', marginBottom: '40px', gap: '4px', overflowX: 'auto', maxWidth: '100%' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center rounded-xl text-sm font-semibold cursor-pointer border-none transition-all duration-300 flex-shrink-0"
              style={{
                padding: '10px 16px',
                gap: '8px',
                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-tertiary)',
                boxShadow: activeTab === tab.id ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                transform: activeTab === tab.id ? 'scale(1)' : 'scale(0.98)',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'text' && <TextTab onAnalyze={handleAnalyze} />}
          {activeTab === 'image' && <ImageTab onAnalyze={handleAnalyze} />}
          {activeTab === 'video' && <VideoTab onAnalyze={handleAnalyze} />}
          {activeTab === 'url' && <URLTab onAnalyze={handleAnalyze} />}
        </motion.div>
      </div>
    </div>
  )
}

/* ============================================================
   SCANNING OVERLAY - Enhanced with better progress visualization
   ============================================================ */
function ScanningOverlay({ progress, message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="text-center"
        style={{ padding: '32px 24px', maxWidth: '340px', width: '100%' }}
      >
        {/* Animated Circle Progress */}
        <div className="relative mx-auto" style={{ width: '100px', height: '100px', marginBottom: '28px' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#progressGradient)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={263.89}
              animate={{ strokeDashoffset: 263.89 * (1 - progress / 100) }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          {/* Pulsing glow behind icon */}
          <motion.div
            className="absolute"
            style={{
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(99,102,241,0.15)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanSearch size={26} style={{ color: '#6366f1' }} />
          </div>
        </div>

        {/* Progress percentage */}
        <p className="text-2xl font-bold" style={{ color: '#f1f5f9', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          {Math.round(progress)}%
        </p>

        <p className="text-base font-semibold" style={{ color: '#f1f5f9', marginBottom: '8px' }}>
          Analyzing Content
        </p>

        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm"
          style={{ color: '#94a3b8' }}
        >
          {message || 'Generating analysis report...'}
        </motion.p>

        {/* Progress bar beneath */}
        <div style={{
          width: '100%', height: '4px', borderRadius: '2px',
          background: 'rgba(99,102,241,0.15)', marginTop: '24px', overflow: 'hidden'
        }}>
          <motion.div
            style={{
              height: '100%', borderRadius: '2px',
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ============================================================
   TEXT TAB
   ============================================================ */
function TextTab({ onAnalyze }) {
  const [text, setText] = useState('')

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText()
      setText(clip)
    } catch (e) {
      // Clipboard access denied
    }
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length

  return (
    <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <div className="flex items-center justify-center flex-shrink-0"
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#6366f112', color: '#6366f1' }}>
            <FileText size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Paste or type your text
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Essays, articles, social media posts, or any text content
            </p>
          </div>
        </div>
        <button
          onClick={handlePaste}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border-none transition-all duration-200 flex-shrink-0"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <Clipboard size={13} /> Paste
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here for AI detection analysis..."
        className="input-field resize-none"
        style={{ minHeight: '220px', marginBottom: '20px', lineHeight: 1.7 }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between" style={{ gap: '12px', flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
            {wordCount} words
          </span>
          {wordCount > 10 && (
            <span className="text-xs" style={{ color: '#22c55e' }}>
              <CheckCircle size={12} className="inline mr-1" />Ready to analyze
            </span>
          )}
        </div>
        <button
          onClick={() => text.trim() && onAnalyze('text', text)}
          disabled={!text.trim()}
          className="btn-primary flex items-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ padding: '12px 28px' }}
        >
          <ScanSearch size={16} />
          Analyze Text
        </button>
      </div>
    </div>
  )
}

/* ============================================================
   IMAGE TAB
   ============================================================ */
function ImageTab({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#06b6d412', color: '#06b6d4' }}>
          <Image size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Upload an image
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Detect AI-generated images, manipulations, and deepfakes
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <label
          className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-tertiary)',
            borderRadius: '16px',
            padding: '56px 24px'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#06b6d4'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div className="flex items-center justify-center"
            style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#06b6d410', color: '#06b6d4', marginBottom: '16px' }}>
            <Upload size={24} />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Click to upload or drag & drop
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            PNG, JPG, WEBP up to 10MB
          </span>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="relative overflow-hidden" style={{ borderRadius: '16px', background: 'var(--bg-tertiary)', marginBottom: '20px' }}>
          <img src={preview} alt="Preview" className="w-full object-contain" style={{ height: '240px' }} />
          <button
            onClick={clearFile}
            className="absolute top-3 right-3 flex items-center justify-center cursor-pointer border-none"
            style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(0,0,0,0.6)', color: 'white' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {file && (
        <div className="flex items-center justify-between" style={{ marginTop: '20px', gap: '12px', flexWrap: 'wrap' }}>
          <div className="flex items-center gap-2.5" style={{ minWidth: 0 }}>
            <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            onClick={() => onAnalyze('image', file)}
            className="btn-primary flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            style={{ padding: '12px 28px' }}
          >
            <ScanSearch size={16} />
            Analyze Image
          </button>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   VIDEO TAB
   ============================================================ */
function VideoTab({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f && f.type.startsWith('video/')) {
      setFile(f)
    }
  }

  return (
    <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#8b5cf612', color: '#8b5cf6' }}>
          <Video size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Upload a video
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Detect deepfakes, face swaps, and AI-generated video content
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!file ? (
        <label
          className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-tertiary)',
            borderRadius: '16px',
            padding: '56px 24px'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div className="flex items-center justify-center"
            style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#8b5cf610', color: '#8b5cf6', marginBottom: '16px' }}>
            <Video size={24} />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Click to upload video
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            MP4, MOV, WEBM up to 50MB
          </span>
          <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center justify-between" style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
            <div className="flex items-center justify-center flex-shrink-0"
              style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#8b5cf612', color: '#8b5cf6' }}>
              <Video size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <button onClick={() => setFile(null)} className="ml-2 cursor-pointer border-none bg-transparent flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              <X size={14} />
            </button>
          </div>
          <button
            onClick={() => onAnalyze('video', file)}
            className="btn-primary flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            style={{ padding: '12px 28px' }}
          >
            <ScanSearch size={16} />
            Analyze Video
          </button>
        </div>
      )}

      {/* Info banner */}
      <div className="flex items-start gap-3" style={{
        marginTop: '20px',
        padding: '16px',
        borderRadius: '14px',
        background: '#f59e0b08',
        border: '1px solid #f59e0b15'
      }}>
        <AlertCircle size={14} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Video analysis is a lightweight MVP feature. For best results, use short clips under 2 minutes.
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   URL TAB
   ============================================================ */
function URLTab({ onAnalyze }) {
  const [url, setUrl] = useState('')

  const isValidUrl = (str) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f59e0b12', color: '#f59e0b' }}>
          <Link2 size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Enter a public URL
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Analyze articles, blog posts, and web content from any public URL
          </p>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex" style={{ marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div className="relative" style={{ flex: '1 1 200px', minWidth: 0 }}>
          <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="input-field"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <button
          onClick={() => isValidUrl(url) && onAnalyze('url', url)}
          disabled={!isValidUrl(url)}
          className="btn-primary flex items-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ padding: '12px 28px' }}
        >
          <ScanSearch size={16} />
          <span className="hidden sm:inline">Analyze URL</span>
          <span className="sm:hidden">Go</span>
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
        Supports article URLs, image URLs, and public video links.
      </p>

      {/* Valid URL indicator */}
      {url && isValidUrl(url) && (
        <div className="flex items-center gap-2" style={{ marginTop: '12px' }}>
          <CheckCircle size={12} style={{ color: '#22c55e' }} />
          <span className="text-xs" style={{ color: '#22c55e' }}>Valid URL — ready to analyze</span>
        </div>
      )}
    </div>
  )
}
