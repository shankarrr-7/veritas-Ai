import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, ScanSearch, FileText, Image, Video, Link2,
  BarChart3, Zap, Brain, ArrowRight, ChevronRight,
  CheckCircle, Eye, Lock, Sparkles, Globe
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
}

export default function Landing() {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ContentTypesSection />
      <WhyVeritasSection />
    </div>
  )
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-3xl"
          style={{
            top: '15%', left: '20%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, #6366f1, transparent)', opacity: 0.12
          }} />
        <div className="absolute rounded-full blur-3xl"
          style={{
            bottom: '20%', right: '15%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, #06b6d4, transparent)', opacity: 0.1
          }} />
      </div>

      <div className="page-container relative z-10 w-full py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <Sparkles size={14} style={{ color: '#6366f1' }} />
            <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Advanced AI Detection Technology
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              maxWidth: '900px'
            }}
          >
            Detect <span className="gradient-text">AI-Generated</span>{' '}
            <span className="gradient-text">&amp; Manipulated</span>{' '}
            Content Instantly
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg mb-12 leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              lineHeight: 1.8
            }}
          >
            Analyze text, images, and videos with advanced AI detection.
            Get detailed reports on content authenticity, deepfake probability,
            and manipulation indicators.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ marginBottom: '80px' }}
          >
            <Link to="/analyze" className="no-underline">
              <button className="btn-primary flex items-center gap-2.5 !px-8 !py-4 !text-base cursor-pointer">
                <ScanSearch size={18} />
                Start Free Analysis
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/login" className="no-underline">
              <button className="btn-secondary flex items-center gap-2 !px-8 !py-4 !text-base cursor-pointer">
                Sign In
                <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>

          {/* Demo Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="glass-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
              {/* Window Chrome */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                <span className="text-xs font-medium ml-3" style={{ color: 'var(--text-tertiary)' }}>
                  veritas-ai — content analysis
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Mini Meter */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg width="112" height="112" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="56" cy="56" r="48" fill="none" stroke="var(--border-color)" strokeWidth="8" opacity="0.3" />
                    <motion.circle
                      cx="56" cy="56" r="48" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={301.59}
                      initial={{ strokeDashoffset: 301.59 }}
                      animate={{ strokeDashoffset: 301.59 * 0.22 }}
                      transition={{ delay: 1.4, duration: 1.5, ease: 'easeOut' }}
                      style={{ filter: 'drop-shadow(0 0 8px #ef444430)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>78%</span>
                    <span className="text-xs font-medium" style={{ color: '#ef4444' }}>AI</span>
                  </div>
                </div>

                {/* Analysis Bars */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Content Analysis Report
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: '#ef444415', color: '#ef4444' }}>
                      High AI Probability
                    </span>
                  </div>
                  {[
                    { label: 'AI Patterns Detected', value: '78%', color: '#ef4444' },
                    { label: 'Writing Consistency', value: '92%', color: '#f59e0b' },
                    { label: 'Lexical Diversity', value: '34%', color: '#22c55e' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between mb-3 last:mb-0">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                            initial={{ width: '0%' }}
                            animate={{ width: item.value }}
                            transition={{ delay: 1.8 + i * 0.25, duration: 0.9, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-9 text-right" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FEATURES SECTION
   ============================================================ */
function FeaturesSection() {
  const features = [
    {
      icon: <FileText size={22} />,
      title: 'AI Text Detection',
      description: 'Analyze articles, essays, and text content. Detect AI-generated writing patterns, repetitive phrasing, and synthetic language markers.',
      color: '#6366f1'
    },
    {
      icon: <Image size={22} />,
      title: 'Image Analysis',
      description: 'Upload images to detect AI generation, manipulation artifacts, and synthetic patterns. Analyze metadata and pixel-level inconsistencies.',
      color: '#06b6d4'
    },
    {
      icon: <Video size={22} />,
      title: 'Deepfake Video Detection',
      description: 'Analyze videos for deepfake indicators. Frame extraction, facial analysis, and temporal consistency checks for authenticity.',
      color: '#8b5cf6'
    },
    {
      icon: <Link2 size={22} />,
      title: 'URL Analysis',
      description: 'Paste any public URL to analyze its content. We extract and evaluate articles, images, and media from web sources.',
      color: '#f59e0b'
    },
    {
      icon: <BarChart3 size={22} />,
      title: 'Smart Reports',
      description: 'Detailed analysis reports with probability meters, confidence scores, pattern highlights, and actionable explanations.',
      color: '#22c55e'
    },
    {
      icon: <Brain size={22} />,
      title: 'AI Intelligence',
      description: 'Powered by advanced detection algorithms that continuously improve. Multi-layered analysis for maximum accuracy.',
      color: '#ec4899'
    }
  ]

  return (
    <section id="features" style={{ background: 'var(--bg-secondary)' }}>
      <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <motion.div {...fadeUp} className="text-center" style={{ marginBottom: '64px' }}>
          <span className="text-xs font-semibold uppercase tracking-widest block"
            style={{ color: '#6366f1', marginBottom: '16px' }}>
            Features
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            Everything You Need to<br />
            <span className="gradient-text">Verify Content</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Comprehensive AI detection tools for text, images, videos, and web content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card cursor-default text-center"
              style={{ padding: '32px' }}
            >
              <div className="flex items-center justify-center mx-auto"
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${feature.color}12`, color: feature.color,
                  marginBottom: '20px'
                }}>
                {feature.icon}
              </div>
              <h3 className="font-semibold" style={{
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                marginBottom: '10px',
                letterSpacing: '-0.01em'
              }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   HOW IT WORKS SECTION
   ============================================================ */
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload or Paste',
      description: 'Paste text, upload an image or video, or enter a public URL. We support multiple content formats.',
      icon: <ScanSearch size={24} />
    },
    {
      number: '02',
      title: 'AI Analyzes',
      description: 'Our detection engine analyzes patterns, artifacts, metadata, and structural markers in seconds.',
      icon: <Brain size={24} />
    },
    {
      number: '03',
      title: 'View Results',
      description: 'Get a detailed report with probability scores, confidence levels, and comprehensive explanations.',
      icon: <BarChart3 size={24} />
    }
  ]

  return (
    <section>
      <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <motion.div {...fadeUp} className="text-center" style={{ marginBottom: '72px' }}>
          <span className="text-xs font-semibold uppercase tracking-widest block"
            style={{ color: '#06b6d4', marginBottom: '16px' }}>
            How It Works
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            Simple. Fast. <span className="gradient-text">Intelligent.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Three steps to verify any content's authenticity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '40px' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] h-px"
                  style={{
                    width: 'calc(100% - 80px)',
                    background: 'linear-gradient(90deg, var(--border-color), var(--border-color) 50%, transparent)'
                  }} />
              )}

              <div className="relative z-10 flex items-center justify-center mx-auto"
                style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  background: 'var(--gradient-primary)', color: 'white',
                  marginBottom: '24px',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)'
                }}>
                {step.icon}
              </div>

              <span className="text-xs font-bold block" style={{ color: '#6366f1', marginBottom: '10px', letterSpacing: '0.05em' }}>
                STEP {step.number}
              </span>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p className="text-sm mx-auto" style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.75 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   CONTENT TYPES SECTION
   ============================================================ */
function ContentTypesSection() {
  const types = [
    { icon: <FileText size={28} />, label: 'Text & Articles', desc: 'Essays, articles, documents', color: '#6366f1' },
    { icon: <Image size={28} />, label: 'Images', desc: 'Photos, graphics, artwork', color: '#06b6d4' },
    { icon: <Video size={28} />, label: 'Videos', desc: 'Short clips, recordings', color: '#8b5cf6' },
    { icon: <Globe size={28} />, label: 'URLs & Links', desc: 'Web pages, public content', color: '#f59e0b' },
  ]

  return (
    <section style={{ background: 'var(--bg-secondary)' }}>
      <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <motion.div {...fadeUp} className="text-center" style={{ marginBottom: '64px' }}>
          <span className="text-xs font-semibold uppercase tracking-widest block"
            style={{ color: '#8b5cf6', marginBottom: '16px' }}>
            Supported Content
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            Analyze <span className="gradient-text">Any Content Type</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Upload or paste content in any format for instant AI detection.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto" style={{ gap: '20px' }}>
          {types.map((type, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card text-center cursor-default"
              style={{ padding: '32px 20px' }}
            >
              <div className="flex items-center justify-center mx-auto"
                style={{
                  width: '60px', height: '60px', borderRadius: '18px',
                  background: `${type.color}10`, color: type.color,
                  marginBottom: '16px'
                }}>
                {type.icon}
              </div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>
                {type.label}
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                {type.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   WHY VERITAS AI SECTION
   ============================================================ */
function WhyVeritasSection() {
  const reasons = [
    { icon: <Zap size={20} />, title: 'Lightning Fast', description: 'Results in seconds, not minutes. Our optimized engine delivers instant analysis.', color: '#f59e0b' },
    { icon: <Eye size={20} />, title: 'Detailed Reports', description: 'Comprehensive analysis with probability scores, explanations, and visual insights.', color: '#06b6d4' },
    { icon: <Lock size={20} />, title: 'Privacy First', description: 'Your content is analyzed and never stored permanently. Complete privacy protection.', color: '#22c55e' },
    { icon: <CheckCircle size={20} />, title: 'High Accuracy', description: 'Multi-layered detection algorithms provide reliable authenticity verification.', color: '#8b5cf6' },
  ]

  return (
    <section>
      <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
        {/* Centered Header */}
        <motion.div {...fadeUp} className="text-center" style={{ marginBottom: '64px' }}>
          <span className="text-xs font-semibold uppercase tracking-widest block"
            style={{ color: '#22c55e', marginBottom: '16px' }}>
            Why Veritas AI
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            Built for{' '}
            <span className="gradient-text">Trust &amp; Accuracy</span>
          </h2>
          <p className="section-subtitle mx-auto" style={{ marginBottom: '16px' }}>
            In a world of increasing AI-generated content, Veritas AI provides the tools you need to verify authenticity.
            Our detection platform combines multiple analysis techniques for reliable results.
          </p>
          <Link to="/analyze" className="no-underline inline-block" style={{ marginTop: '24px' }}>
            <button className="btn-primary flex items-center gap-2.5 cursor-pointer mx-auto">
              Get Started Free
              <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto" style={{ gap: '16px' }}>
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card text-center"
              style={{ padding: '32px 24px' }}
            >
              <div className="flex items-center justify-center mx-auto"
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${reason.color}12`, color: reason.color,
                  marginBottom: '16px'
                }}>
                {reason.icon}
              </div>
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {reason.title}
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
