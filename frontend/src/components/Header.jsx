import { motion } from 'framer-motion'
import { TrendingUp, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white shadow-md border-b-4 border-gold-500"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="text-white" size={24} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-700 to-gold-500 bg-clip-text text-transparent">
                Sona-AI
              </h1>
              <p className="text-sm text-gray-600">Bharat Edition</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm font-medium text-green-700">Live Predictions</span>
          </div>
        </div>
        
        <p className="mt-3 text-gray-600 text-center md:text-left">
          AI-Powered Gold & Silver Forecasting for Every Indian City
        </p>
      </div>
    </motion.header>
  )
}