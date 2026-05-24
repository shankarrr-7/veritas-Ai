import { motion } from 'framer-motion'

export default function CircularMeter({ percentage, size = 200, strokeWidth = 12, label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const getColor = (pct) => {
    if (pct >= 70) return '#ef4444'
    if (pct >= 45) return '#f59e0b'
    return '#22c55e'
  }

  const color = getColor(percentage)

  return (
    <div className="circular-meter" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="meter-text">
        <motion.span
          className="text-3xl font-bold block"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {percentage}%
        </motion.span>
        {label && (
          <span className="text-xs font-medium block mt-1" style={{ color }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-xs block" style={{ color: 'var(--text-tertiary)' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
