import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PriceCard({ title, price, subtitle, trend, confidence, delay = 0 }) {
  const [displayPrice, setDisplayPrice] = useState(0)

  useEffect(() => {
    // Animated counter effect
    let start = 0
    const end = price
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayPrice(end)
        clearInterval(timer)
      } else {
        setDisplayPrice(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [price])

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="text-green-600" size={24} />
    if (trend < 0) return <TrendingDown className="text-red-600" size={24} />
    return <Minus className="text-gray-400" size={24} />
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {getTrendIcon()}
      </div>

      <div className="mb-3">
        <motion.div
          key={displayPrice}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-gold-700 to-gold-500 bg-clip-text text-transparent"
        >
          ₹{displayPrice.toLocaleString('en-IN')}
        </motion.div>
        <p className="text-sm text-gray-500 mt-1">per 10 grams</p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-sm text-gray-600">{subtitle}</p>
        {trend !== undefined && trend !== 0 && (
          <p className={`text-sm font-medium mt-1 ${getTrendColor()}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(2)}% {trend > 0 ? 'increase' : 'decrease'}
          </p>
        )}
        {confidence && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className={`h-2 rounded-full ${
                  confidence >= 80 ? 'bg-green-500' : 
                  confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}