import { createContext, useContext, useState, useEffect } from 'react'

const ScanContext = createContext()

export function ScanProvider({ children }) {
  const [scanHistory, setScanHistory] = useState(() => {
    const saved = localStorage.getItem('veritas-scans')
    return saved ? JSON.parse(saved) : []
  })
  const [currentScan, setCurrentScan] = useState(null)

  useEffect(() => {
    localStorage.setItem('veritas-scans', JSON.stringify(scanHistory.slice(0, 50)))
  }, [scanHistory])

  const addScan = (scan) => {
    const newScan = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...scan
    }
    setScanHistory(prev => [newScan, ...prev])
    setCurrentScan(newScan)
    return newScan
  }

  const deleteScan = (id) => {
    setScanHistory(prev => prev.filter(s => s.id !== id))
  }

  const clearHistory = () => {
    setScanHistory([])
    localStorage.removeItem('veritas-scans')
  }

  return (
    <ScanContext.Provider value={{
      scanHistory,
      currentScan,
      setCurrentScan,
      addScan,
      deleteScan,
      clearHistory
    }}>
      {children}
    </ScanContext.Provider>
  )
}

export const useScans = () => useContext(ScanContext)
