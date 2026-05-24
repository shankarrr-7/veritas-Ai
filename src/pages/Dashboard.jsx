import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useScans } from '../context/ScanContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  ScanSearch, FileText, Image, Video, Link2, Clock,
  Trash2, ExternalLink, User, LayoutDashboard, Plus,
  BarChart3, Shield
} from 'lucide-react'

const typeIcons = {
  text: <FileText size={14} />,
  image: <Image size={14} />,
  video: <Video size={14} />,
  url: <Link2 size={14} />,
}

const typeColors = {
  text: '#6366f1',
  image: '#06b6d4',
  video: '#8b5cf6',
  url: '#f59e0b',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { scanHistory, deleteScan } = useScans()

  const stats = {
    total: scanHistory.length,
    text: scanHistory.filter(s => s.result?.type === 'text').length,
    image: scanHistory.filter(s => s.result?.type === 'image').length,
    video: scanHistory.filter(s => s.result?.type === 'video').length,
    url: scanHistory.filter(s => s.result?.type === 'url').length,
  }

  const avgAI = scanHistory.length > 0
    ? Math.round(scanHistory.reduce((a, s) => a + (s.result?.aiProbability || 0), 0) / scanHistory.length)
    : 0

  const pieData = [
    { name: 'Text', value: stats.text || 1, color: '#6366f1' },
    { name: 'Image', value: stats.image || 1, color: '#06b6d4' },
    { name: 'Video', value: stats.video || 1, color: '#8b5cf6' },
    { name: 'URL', value: stats.url || 1, color: '#f59e0b' },
  ]

  const recentChartData = scanHistory.slice(0, 7).reverse().map((scan, i) => ({
    name: `#${i + 1}`,
    ai: scan.result?.aiProbability || 0,
    human: scan.result?.humanProbability || 0,
  }))

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }} className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ marginBottom: '40px' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={20} style={{ color: '#6366f1' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Dashboard
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user ? `Welcome back, ${user.displayName || user.email}` : 'Your content analysis overview'}
            </p>
          </div>
          <Link to="/analyze" className="no-underline">
            <button className="btn-primary flex items-center gap-2 !py-2.5 cursor-pointer">
              <Plus size={16} />
              New Scan
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px', marginBottom: '24px' }}
        >
          {[
            { label: 'Total Scans', value: stats.total, icon: <ScanSearch size={16} />, color: '#6366f1' },
            { label: 'Avg AI Score', value: `${avgAI}%`, icon: <BarChart3 size={16} />, color: '#06b6d4' },
            { label: 'Text Scans', value: stats.text, icon: <FileText size={16} />, color: '#8b5cf6' },
            { label: 'Media Scans', value: stats.image + stats.video, icon: <Image size={16} />, color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '20px' }}>
          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recent Analysis Scores
            </h3>
            {recentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={recentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="ai" fill="#6366f1" name="AI %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="human" fill="#22c55e" name="Human %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-56" style={{ color: 'var(--text-tertiary)' }}>
                <p className="text-sm">No scan data yet. Start your first analysis!</p>
              </div>
            )}
          </motion.div>

          {/* Scan Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Scan Distribution
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    fontSize: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scan History */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6" style={{ marginTop: '20px' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Scan History
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {scanHistory.length} scans
            </span>
          </div>

          {scanHistory.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {scanHistory.slice(0, 15).map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center justify-between p-3.5 rounded-xl group"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${typeColors[scan.result?.type]}15`, color: typeColors[scan.result?.type] }}>
                      {typeIcons[scan.result?.type]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {scan.result?.type === 'text'
                          ? (scan.input?.slice(0, 60) + (scan.input?.length > 60 ? '…' : ''))
                          : scan.result?.type === 'url'
                            ? scan.input
                            : `${scan.result?.type} file`}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <Clock size={10} className="inline mr-1" />
                          {new Date(scan.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium" style={{
                          color: scan.result?.aiProbability > 60 ? '#ef4444' : scan.result?.aiProbability > 40 ? '#f59e0b' : '#22c55e'
                        }}>
                          {scan.result?.aiProbability}% AI
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/results/${scan.id}`} className="no-underline">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                        <ExternalLink size={13} />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteScan(scan.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'var(--bg-card)', color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield size={40} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                No scans yet. Start analyzing content!
              </p>
              <Link to="/analyze" className="no-underline">
                <button className="btn-primary !py-2 !text-sm cursor-pointer">Start Scanning</button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
