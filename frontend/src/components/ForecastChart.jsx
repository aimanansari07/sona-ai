import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'

export default function ForecastChart({ data, metal }) {
  const chartData = [
    { day: 'Today', price: data.currentPrice, zone: 'current' },
    ...data.forecast.map((item, index) => ({
      day: `Day ${index + 1}`,
      price: item.price,
      zone: index < 3 ? 'high' : 'trend',
      confidence: item.confidence,
    }))
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gold-200">
          <p className="font-semibold text-gray-800">{data.day}</p>
          <p className="text-2xl font-bold text-gold-600">
            ₹{data.price.toLocaleString('en-IN')}
          </p>
          {data.confidence && (
            <p className="text-sm text-gray-600 mt-1">
              Confidence: {data.confidence}%
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {data.zone === 'high' ? '🎯 High Confidence' : '📊 Trend Zone'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          7-Day Price Forecast
        </h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">High Confidence (Days 1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Trend Zone (Days 4-7)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#666"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="none"
            fill="url(#colorPrice)"
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#D4AF37"
            strokeWidth={3}
            dot={{ fill: '#D4AF37', r: 6 }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 How to read:</strong> The first 3 days show high-confidence predictions 
          based on current market conditions. Days 4-7 represent trend estimates that may 
          vary based on global market changes.
        </p>
      </div>
    </motion.div>
  )
}