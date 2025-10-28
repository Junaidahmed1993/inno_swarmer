# Innovation Tracker Tool 🚀

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://innoecosystem.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)

> **Live Demo:** [https://innoecosystem.netlify.app/](https://innoecosystem.netlify.app/)

A sophisticated ecosystem mapping and visualization platform designed to track innovation networks, with a special focus on **Positive Impact Startups** and **Social Tangling** dynamics.

## 📋 Overview

The Innovation Tracker Tool is part of the **Mapping Innovation for Impact – Swarm Innovation and Social Tangling** project. It provides interactive network visualization capabilities to map relationships between startups, investors, accelerators, universities, NGOs, and government bodies within innovation ecosystems.

### Key Features

- 🌐 **Interactive Network Visualization** - Force-directed graph showing ecosystem relationships
- 🔍 **Advanced Filtering** - Filter by organization type, impact area, and development stage
- 🔎 **Real-time Search** - Quickly find specific organizations
- 📊 **Network Analytics** - Live statistics on organizations, connections, and clusters
- 🎯 **Impact Focus** - Track organizations aligned with UN Sustainable Development Goals (SDGs)
- 🤝 **Social Tangling Visualization** - Identify collaboration patterns between startups
- 📸 **Export Capabilities** - Generate high-resolution PNG exports for reports
- 🎨 **Visual Encoding** - Different shapes and colors for easy organization identification

## 🏗️ Architecture

Built on proven technologies for reliability and scalability:

- **Frontend Framework:** React 18 with TypeScript
- **Network Visualization:** Cytoscape.js
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Create React App
- **Deployment:** Netlify (Continuous Deployment)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/innovation-tracker.git
   cd innovation-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (⚠️ one-way operation)

### Project Structure

```
innovation-tracker/
├── public/              # Static files
├── src/
│   ├── App.tsx         # Main application component
│   ├── index.tsx       # Application entry point
│   ├── index.css       # Global styles (Tailwind)
│   └── react-app-env.d.ts
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md          # This file
```

## 📊 Data Structure

### Node Data Model

```typescript
interface NodeData {
  id: string;
  label: string;
  type: 'startup' | 'investor' | 'accelerator' | 'university' | 'ngo' | 'government';
  impact: string;
  stage: string;
  description: string;
  sdg?: string[];  // UN Sustainable Development Goals
}
```

### Edge Data Model

```typescript
interface EdgeData {
  source: string;
  target: string;
  type: 'funding' | 'mentorship' | 'research' | 'partnership' | 'grant' | 'collaboration';
  strength: 'strong' | 'medium' | 'weak';
}
```

## 🎨 Customization

### Adding Your Own Data

Replace the sample data in `src/App.tsx` starting at line 23:

```typescript
const ecosystemData: { nodes: NodeData[], edges: EdgeData[] } = {
  nodes: [
    // Your organizations here
  ],
  edges: [
    // Your relationships here
  ]
};
```

### Styling

- Tailwind classes are used throughout the application
- Modify `tailwind.config.js` to customize the design system
- Node colors and shapes are defined in the Cytoscape styles (line 150-240)

## 🌍 Use Cases

- **Ecosystem Mapping** - Visualize regional or sectoral innovation ecosystems
- **Impact Analysis** - Track organizations working on specific SDGs
- **Network Analysis** - Identify key connectors and isolated actors
- **Investment Tracking** - Monitor funding flows and investor networks
- **Research Collaboration** - Map university-industry partnerships
- **Policy Planning** - Understand ecosystem gaps and opportunities

## 📚 Based on Research

This tool builds upon methodologies from:

- [EU Foresight Knowledge Base](https://knowledge4policy.ec.europa.eu/foresight_en)
- [Complex System Analyser](https://knowledge4policy.ec.europa.eu/foresight/topic/complex-system-analyser_en)
- [Endeavor's Tech Sector Mapping](https://endeavor.org/mapping-polands-tech-sector/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Mapping Innovation for Impact Project**

- Development collaboration with Silicon Valley partners
- Focus on positive impact startups and social innovation

## 🔗 Links

- **Live Application:** [https://innoecosystem.netlify.app/](https://innoecosystem.netlify.app/)
- **Documentation:** [Link to documentation]
- **Project Website:** [Link to project website]

## 📧 Contact

For questions or collaboration opportunities, please reach out through GitHub issues or contact the project team.

---

**Built with ❤️ for social impact and innovation ecosystem development**