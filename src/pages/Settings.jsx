import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useScans } from '../context/ScanContext'
import {
  Settings as SettingsIcon, User, Sun, Moon, Monitor,
  Trash2, LogOut, Shield, Lock, Eye, Bell, ChevronRight
} from 'lucide-react'

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { clearHistory, scanHistory } = useScans()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleClearHistory = () => {
    clearHistory()
    setShowDeleteConfirm(false)
  }

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }} className="min-h-screen">
      <div className="page-container max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '40px' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon size={20} style={{ color: '#6366f1' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Settings
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your account, appearance, and privacy preferences.
          </p>
        </motion.div>

        <div className="flex flex-col" style={{ gap: '20px' }}>
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User size={16} style={{ color: '#6366f1' }} />
              Account
            </h3>

            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--gradient-primary)', color: 'white', fontSize: '14px', fontWeight: 700 }}>
                      {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-3.5 rounded-xl cursor-pointer border-none text-left w-full transition-colors duration-200"
                  style={{ background: 'var(--bg-tertiary)', color: '#ef4444' }}
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-tertiary)' }}>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Sign in to access all features
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary !py-2 !text-sm cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Eye size={16} style={{ color: '#06b6d4' }} />
              Appearance
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', icon: <Sun size={18} /> },
                { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: theme === opt.id ? '#6366f1' : 'var(--border-color)',
                    color: theme === opt.id ? '#6366f1' : 'var(--text-secondary)',
                    boxShadow: theme === opt.id ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none'
                  }}
                >
                  {opt.icon}
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Lock size={16} style={{ color: '#22c55e' }} />
              Privacy & Data
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Scan History</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {scanHistory.length} scans saved locally
                  </p>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 p-3.5 rounded-xl cursor-pointer border-none text-left w-full"
                  style={{ background: '#ef444410', color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                  <span className="text-sm font-medium">Clear All History & Reports</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                  <p className="text-sm mb-3" style={{ color: '#ef4444' }}>
                    Are you sure? This will delete all scan history and saved reports permanently.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearHistory}
                      className="btn-primary !py-2 !text-sm cursor-pointer"
                      style={{ background: '#ef4444' }}
                    >
                      Delete Everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary !py-2 !text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield size={16} style={{ color: '#8b5cf6' }} />
              About
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Version', value: '1.0.0 MVP' },
                { label: 'Platform', value: 'Veritas AI' },
                { label: 'Built with', value: 'React, Tailwind, Firebase' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
