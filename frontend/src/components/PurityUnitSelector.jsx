import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'
import useStore from '../store/useStore'

const GOLD_PURITIES = ['18K', '22K', '24K']
const GOLD_UNITS = [
  { value: 1, label: '1 gram' },
  { value: 5, label: '5 grams' },
  { value: 10, label: '10 grams' },
  { value: 100, label: '100 grams' }
]

const SILVER_UNITS = [
  { value: 1, label: '1 gram' },
  { value: 100, label: '100 grams' },
  { value: 1000, label: '1 kg' }
]

export default function PurityUnitSelector() {
  const { metal, purity, unit, setPurity, setUnit } = useStore()

  const availableUnits = metal === 'gold' ? GOLD_UNITS : SILVER_UNITS

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2">
        <Scale className="text-gold-600" size={20} />
        <span className="font-medium text-gray-700">Options:</span>
      </div>
      
      {/* Purity Selector (Gold only) */}
      {metal === 'gold' && (
        <select
          value={purity}
          onChange={(e) => setPurity(e.target.value)}
          className="input-field min-w-[120px]"
        >
          {GOLD_PURITIES.map(p => (
            <option key={p} value={p}>{p} Purity</option>
          ))}
        </select>
      )}

      {/* Unit Selector */}
      <select
        value={unit}
        onChange={(e) => setUnit(Number(e.target.value))}
        className="input-field min-w-[140px]"
      >
        {availableUnits.map(u => (
          <option key={u.value} value={u.value}>{u.label}</option>
        ))}
      </select>
    </motion.div>
  )
}