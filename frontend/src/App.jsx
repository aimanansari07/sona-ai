import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import LocationSelector from './components/LocationSelector'
import PriceCard from './components/PriceCard'
import ForecastChart from './components/ForecastChart'
import LoadingSpinner from './components/LoadingSpinner'
import { fetchPredictions } from './utils/api'
import useStore from './store/useStore'

function App() {
  const { metal, location, setMetal, setLocation } = useStore()
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPredictions()
  }, [metal, location])

  const loadPredictions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPredictions(metal, location.state, location.city)
      setPredictions(data)
    } catch (err) {
      setError('Failed to load predictions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Metal Selector & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Metal Toggle */}
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-md">
              <button
                onClick={() => setMetal('gold')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  metal === 'gold'
                    ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🪙 Gold
              </button>
              <button
                onClick={() => setMetal('silver')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  metal === 'silver'
                    ? 'bg-gradient-to-r from-silver-500 to-silver-400 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ⚪ Silver
              </button>
            </div>

            {/* Location Selector */}
            <LocationSelector />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8"
          >
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={loadPredictions}
              className="mt-3 w-full btn-primary"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && predictions && (
          <>
            {/* Price Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <PriceCard
                title="Today's Price"
                price={predictions.currentPrice}
                subtitle={`${location.city}, ${location.state}`}
                trend={0}
                delay={0.1}
              />
              <PriceCard
                title="Tomorrow's Forecast"
                price={predictions.forecast[0].price}
                subtitle={`High Confidence Zone`}
                trend={predictions.forecast[0].trend}
                confidence={predictions.forecast[0].confidence}
                delay={0.2}
              />
              <PriceCard
                title="7-Day Average"
                price={predictions.weekAverage}
                subtitle="Trend Zone Estimate"
                trend={predictions.weekTrend}
                delay={0.3}
              />
            </motion.div>

            {/* Forecast Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ForecastChart data={predictions} metal={metal} />
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
            >
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Predictions are AI-generated estimates for informational purposes only. 
                Actual prices may vary. Always verify with local jewelers before purchasing.
              </p>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Sona-AI. AI-Powered Gold & Silver Forecasting for India.</p>
          <p className="mt-2">Made with ❤️ for every Indian investor</p>
        </div>
      </footer>
    </div>
  )
}

export default App