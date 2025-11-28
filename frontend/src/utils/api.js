import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const fetchPredictions = async (metal, state, city, purity = '22K', unit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/predict`, {
      params: { metal, state, city, purity, unit }
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const refreshModels = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/refresh-models`)
    return response.data
  } catch (error) {
    console.error('Refresh Error:', error)
    throw error
  }
}