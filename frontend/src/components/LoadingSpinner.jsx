import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={48} className="text-gold-600" />
      </motion.div>
      <p className="mt-4 text-gray-600 font-medium">Loading predictions...</p>
      <p className="text-sm text-gray-500">Analyzing market data</p>
    </motion.div>
  )
}