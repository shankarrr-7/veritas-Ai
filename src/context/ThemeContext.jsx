import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('veritas-theme')
    return saved || 'dark'
  })

  // Resolve actual theme (system → light/dark)
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    localStorage.setItem('veritas-theme', theme)
  }, [theme, resolvedTheme])

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.setAttribute('data-theme', getSystemTheme())
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'dark') return 'light'
      return 'dark'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
