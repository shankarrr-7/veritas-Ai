import { motion } from 'framer-motion'
import { Shield, Loader } from 'lucide-react'

export default function ScanningOverlay({ progress, message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-10 max-w-md w-full mx-4 text-center"
      >
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'var(--gradient-primary)', opacity: 0.15 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Shield size={32} className="gradient-text" style={{ color: '#6366f1' }} />
            </motion.div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Analyzing Content
        </h3>

        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          {message}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3"
          style={{ background: 'var(--border-color)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-primary)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {Math.round(progress)}% complete
        </p>
      </motion.div>
    </motion.div>
  )
}
