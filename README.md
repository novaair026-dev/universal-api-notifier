# Universal API Notifier

## 🚀 Live Demo
**Already deployed and ready to use:** [https://notify.work-amazing.us/](https://notify.work-amazing.us/)

Try the service instantly - no setup required!

## 📖 Overview
Universal API Notifier is a fully cross-platform notification service that lets you send custom notifications via simple API calls. Perfect for alerts, updates, and real-time messaging across all devices and browsers.

## 🎯 Problems Solved
- **Fragmented notification systems** - Single API works everywhere (web, mobile, desktop)
- **Complex setup & deployment** - Live service ready at https://notify.work-amazing.us/
- **Platform limitations** - Full cross-platform support, no browser restrictions
- **Slow delivery** - Lightning-fast notifications with minimal latency
- **Rigid templates** - Fully customizable messages and payloads

## ✨ Key Advantages
- **🔥 Live & Free** - Use instantly at https://notify.work-amazing.us/ - no signup required
- **🌐 Full Cross-Platform** - Works on all devices/browsers seamlessly
- **⚡ Lightning Fast** - Minimal latency, optimized API delivery
- **🆓 Completely Free** - Open source, no hidden costs
- **🔧 Fully Customizable** - Tailor notifications to your exact needs

## 🚀 Quick Start (Self-Hosted)
```bash
npm install
npm run dev  # Development
npm run build  # Production build
```

**Or use the live service directly:** https://notify.work-amazing.us/

## 📋 API Usage
Send notifications via simple POST:

```bash
curl -X POST https://notify.work-amazing.us/api/notify \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello!",
    "message": "Custom notification via API",
    "type": "info"
  }'
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
MIT License - Free to use anywhere!
