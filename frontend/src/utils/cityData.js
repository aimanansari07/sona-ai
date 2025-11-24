// City spreads: percentage adjustment from base MCX price
// Positive = premium, Negative = discount

export const CITY_SPREADS = {
  // Maharashtra
  'Mumbai': 0.0,      // Base city (MCX reference)
  'Pune': 0.1,
  'Nagpur': 0.15,
  'Nashik': 0.12,
  'Aurangabad': 0.18,
  
  // Delhi NCR
  'Delhi': 0.05,
  'Noida': 0.08,
  'Gurgaon': 0.08,
  'Ghaziabad': 0.10,
  'Faridabad': 0.12,
  
  // Karnataka
  'Bangalore': 0.08,
  'Mysore': 0.20,
  'Mangalore': 0.25,
  'Hubli': 0.22,
  
  // Tamil Nadu
  'Chennai': -0.10,   // Slightly cheaper due to high competition
  'Coimbatore': 0.15,
  'Madurai': 0.18,
  'Salem': 0.20,
  'Tiruchirappalli': 0.19,
  
  // West Bengal
  'Kolkata': 0.12,
  'Siliguri': 0.28,
  'Durgapur': 0.25,
  
  // Telangana
  'Hyderabad': 0.10,
  'Warangal': 0.22,
  'Nizamabad': 0.25,
  
  // Gujarat
  'Ahmedabad': 0.05,
  'Surat': 0.08,
  'Vadodara': 0.12,
  'Rajkot': 0.15,
  
  // Rajasthan
  'Jaipur': 0.20,
  'Udaipur': 0.25,
  'Jodhpur': 0.22,
  'Kota': 0.23,
  
  // Uttar Pradesh
  'Lucknow': 0.15,
  'Kanpur': 0.18,
  'Agra': 0.20,
  'Varanasi': 0.22,
  'Meerut': 0.17,
  
  // Punjab
  'Chandigarh': 0.18,
  'Ludhiana': 0.20,
  'Amritsar': 0.22,
  'Jalandhar': 0.21,
  
  // Madhya Pradesh
  'Bhopal': 0.20,
  'Indore': 0.18,
  'Gwalior': 0.22,
  'Jabalpur': 0.24,
  
  // Kerala
  'Kochi': 0.15,
  'Thiruvananthapuram': 0.18,
  'Kozhikode': 0.20,
  'Thrissur': 0.22,
  
  // Odisha
  'Bhubaneswar': 0.25,
  'Cuttack': 0.27,
  'Rourkela': 0.30,
  
  // Bihar
  'Patna': 0.22,
  'Gaya': 0.28,
  'Bhagalpur': 0.30,
  
  // Jharkhand
  'Ranchi': 0.25,
  'Jamshedpur': 0.27,
  'Dhanbad': 0.28,
  
  // Assam
  'Guwahati': 0.35,
  'Silchar': 0.40,
  'Dibrugarh': 0.42,
  
  // Uttarakhand
  'Dehradun': 0.20,
  'Haridwar': 0.22,
  'Roorkee': 0.24,
  
  // Himachal Pradesh
  'Shimla': 0.28,
  'Dharamshala': 0.30,
  'Manali': 0.35,
  
  // Jammu & Kashmir
  'Srinagar': 0.30,
  'Jammu': 0.25,
  
  // Goa
  'Panaji': 0.12,
  'Margao': 0.15,
  
  // Andhra Pradesh
  'Visakhapatnam': 0.20,
  'Vijayawada': 0.18,
  'Guntur': 0.22,
  'Tirupati': 0.19,
  
  // Haryana
  'Panipat': 0.15,
  'Karnal': 0.18,
  'Ambala': 0.20,
  
  // Chhattisgarh
  'Raipur': 0.25,
  'Bhilai': 0.27,
  'Bilaspur': 0.28,
}

export const CITIES = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Delhi NCR': ['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'West Bengal': ['Kolkata', 'Siliguri', 'Durgapur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu'],
  'Goa': ['Panaji', 'Margao'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
  'Haryana': ['Panipat', 'Karnal', 'Ambala'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
}