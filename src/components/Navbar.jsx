import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  Shield, Menu, X, User, LogOut, Settings,
  LayoutDashboard, Sun, Moon, ScanSearch
} from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'Dashboard', path: '/dashboard' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}>
              <Shield size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Veritas <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
                style={{
                  color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive(link.path) ? 'var(--bg-tertiary)' : 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="no-underline">
                  <button className="btn-secondary flex items-center gap-2 !py-2 !px-4 !text-sm cursor-pointer">
                    <LayoutDashboard size={15} />
                    Dashboard
                  </button>
                </Link>
                <Link to="/settings" className="no-underline">
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    <Settings size={16} />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="no-underline">
                  <button className="btn-secondary !py-2 !px-5 !text-sm cursor-pointer">Sign In</button>
                </Link>
                <Link to="/analyze" className="no-underline">
                  <button className="btn-primary !py-2 !px-5 !text-sm flex items-center gap-2 cursor-pointer">
                    <ScanSearch size={15} />
                    Try Free
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium no-underline"
                  style={{
                    color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive(link.path) ? 'var(--bg-tertiary)' : 'transparent'
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button
                onClick={() => { toggleTheme(); setMenuOpen(false) }}
                className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 cursor-pointer border-none text-left"
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="no-underline">
                    <button className="w-full btn-secondary flex items-center gap-2 !text-sm cursor-pointer">
                      <LayoutDashboard size={15} /> Dashboard
                    </button>
                  </Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)} className="no-underline">
                    <button className="w-full btn-secondary flex items-center gap-2 !text-sm cursor-pointer">
                      <Settings size={15} /> Settings
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="no-underline">
                    <button className="w-full btn-secondary !text-sm cursor-pointer">Sign In</button>
                  </Link>
                  <Link to="/analyze" onClick={() => setMenuOpen(false)} className="no-underline">
                    <button className="w-full btn-primary !text-sm cursor-pointer">Try Free Scan</button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
