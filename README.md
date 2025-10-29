# Atlas: The Modern Man's Guide 🚀

A comprehensive web application for modern men to improve their lifestyle, habits, and personal development. Built with React, TypeScript, Vite, and modern UI components.

<div align="center">
<img width="1200" height="475" alt="Atlas App Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ Features

- **Modern UI Design**: Clean, responsive interface with glassmorphism effects
- **Comprehensive Guides**: Dating, grooming, fitness, and personal development
- **AI-Powered Mentor**: Get personalized advice and guidance
- **Challenge System**: Track your progress and build better habits
- **Community Features**: Connect with like-minded individuals
- **Mobile Responsive**: Optimized for all devices

## 🚀 Quick Start with Docker

The easiest way to run the application locally is using Docker:

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Run with Docker

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd atlas_-the-modern-man's-guide
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`
   - The app will be running with hot-reload enabled

### Docker Commands

- **Start the application:** `docker-compose up`
- **Start in background:** `docker-compose up -d`
- **Stop the application:** `docker-compose down`
- **View logs:** `docker-compose logs -f`
- **Rebuild after changes:** `docker-compose up --build`

## 🛠️ Manual Installation

If you prefer to run without Docker:

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open `http://localhost:5173` in your browser

## 🏗️ Build for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vite Configuration

The app is configured to run on:
- **Development:** Port 5173
- **Host:** 0.0.0.0 (accessible from other devices on network)
- **Hot Reload:** Enabled with polling for Docker compatibility

## 📁 Project Structure

```
├── components/          # Reusable UI components
├── screens/            # Application screens/pages  
├── services/           # API services and utilities
├── types.ts           # TypeScript type definitions
├── constants.tsx      # Application constants
├── App.tsx           # Main application component
├── index.tsx         # Application entry point
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── README.md         # This file
```

## 🎨 Design System

- **Colors:** Modern dark theme with accent blues
- **Typography:** Inter font family
- **Components:** Glassmorphism effects with smooth transitions
- **Icons:** Lucide React icon library
- **Responsive:** Mobile-first design approach

## 🚀 Deployment

### Using Docker in Production

1. **Build production image:**
   ```bash
   docker-compose -f docker-compose.yml --profile production up --build
   ```

2. **With nginx reverse proxy:**
   ```bash
   docker-compose --profile production up -d
   ```

### Traditional Deployment

1. Build the application: `npm run build`
2. Serve the `dist` folder using your preferred web server
3. Ensure environment variables are properly configured

## 🔍 Troubleshooting

### Docker Issues

- **Port conflicts:** Change the port mapping in `docker-compose.yml`
- **Permission issues:** Ensure Docker has proper permissions
- **Build failures:** Try `docker-compose down` and rebuild

### Development Issues

- **Module not found:** Run `npm install` to ensure all dependencies are installed
- **API errors:** Verify your `GEMINI_API_KEY` is correctly set
- **Hot reload not working:** Try clearing browser cache or restarting the dev server

## 📊 Performance

- **Bundle size:** Optimized with Vite's tree-shaking
- **Loading:** Lazy-loaded components for better performance  
- **Caching:** Browser caching optimized for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**AI Studio App:** https://ai.studio/apps/drive/17zhhGmPv149Jo2PKyxIwtRQRbKvAvjER
