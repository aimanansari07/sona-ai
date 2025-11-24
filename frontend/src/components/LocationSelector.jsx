import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import useStore from '../store/useStore'
import { CITIES } from '../utils/cityData'

export default function LocationSelector() {
  const { location, setLocation } = useStore()

  const states = Object.keys(CITIES)
  const cities = CITIES[location.state] || []

  const handleStateChange = (e) => {
    const newState = e.target.value
    const firstCity = CITIES[newState][0]
    setLocation({ state: newState, city: firstCity })
  }

  const handleCityChange = (e) => {
    setLocation({ ...location, city: e.target.value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2">
        <MapPin className="text-gold-600" size={20} />
        <span className="font-medium text-gray-700">Location:</span>
      </div>
      
      <select
        value={location.state}
        onChange={handleStateChange}
        className="input-field min-w-[150px]"
      >
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        value={location.city}
        onChange={handleCityChange}
        className="input-field min-w-[150px]"
      >
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </motion.div>
  )
}