# 🪙 Sona-AI (Bharat Edition)

> AI-Powered Gold & Silver Price Forecasting for Every Indian City

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🎯 **7-Day AI Predictions** - XGBoost ML models for gold and silver prices
- 📍 **100+ Indian Cities** - Localized pricing for every major city
- 📱 **PWA Enabled** - Install as native app on mobile devices
- 🎨 **Beautiful UI** - Premium gold-themed responsive design
- ⚡ **Real-time Data** - Live market data integration
- 📊 **Interactive Charts** - Confidence zones and trend analysis

## 🚀 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand

### Backend
- FastAPI (Python)
- XGBoost ML
- yfinance API
- Pandas, NumPy

## 📦 Installation

### Prerequisites
```bash
Node.js 16+
Python 3.8+
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_models.py
uvicorn app.main:app --reload
```

## 🌐 Live Demo

- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## 📸 Screenshots

[Add screenshots here]

## 🗺️ Roadmap

- [ ] Price alerts via notifications
- [ ] Historical comparison charts
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export data as PDF

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

Made with ❤️ for Indian investors

---

⭐ Star this repo if you find it useful!