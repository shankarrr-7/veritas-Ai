import { Link } from 'react-router-dom'
import { Shield, Code2, MessageCircle, Mail } from 'lucide-react'

export default function Footer() {
  const links = {
    Product: [
      { label: 'Features', path: '/#features' },
      { label: 'Analyze', path: '/analyze' },
      { label: 'Dashboard', path: '/dashboard' },
    ],
    Company: [
      { label: 'About', path: '/about' },
      { label: 'Privacy', path: '/privacy' },
      { label: 'Terms', path: '/terms' },
    ],
    Support: [
      { label: 'Contact', path: '/contact' },
      { label: 'Documentation', path: '/docs' },
      { label: 'FAQ', path: '/faq' },
    ],
  }

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="page-container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '48px' }}>
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}>
                <Shield size={18} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Veritas <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Advanced AI-powered content analysis and deepfake detection for the modern web.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Code2 size={16} />, href: '#' },
                { icon: <MessageCircle size={16} />, href: '#' },
                { icon: <Mail size={16} />, href: '#' }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                {title}
              </h4>
              <ul className="list-none flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-sm no-underline transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} Veritas AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Built with intelligence. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  )
}
