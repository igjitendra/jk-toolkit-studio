# JK Toolkit Studio

> Universal Photo Sheet Generator — Advanced web-based Photo Layout & Print Automation Toolkit

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Fabric.js](https://img.shields.io/badge/Fabric.js-6-orange)
![PWA](https://img.shields.io/badge/PWA-Offline_Ready-green)

## What is JK Toolkit Studio?

A professional dark-themed photo studio web app built for:
- 📸 Photo Studios
- 🏪 CSC Centers / Aadhaar / PAN operators
- 🖨️ Print Shops & Lamination centers
- 🎓 Schools, Colleges, HR departments

## Core Features

| Feature | Description |
|---|---|
| Multi-person upload | Add multiple people, each with their own photo, size, and quantity |
| Mixed sheet layout | Combine passport, visa, stamp, ID card sizes on one A4 sheet |
| Auto arrangement | Intelligent packing to minimize paper waste |
| Face detection | MediaPipe-based auto-align and crop |
| Background removal | AI remove.bg style + solid color replace |
| ID Card editor | Templates with drag-drop text/photo/QR |
| 300 DPI export | Print-safe JPG, PNG, PDF output |
| Batch processing | Queue 20+ customers efficiently |
| Offline PWA | Works without internet, installable |
| Web Workers | No UI freeze during heavy processing |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Canvas:** Fabric.js + Konva.js
- **AI:** MediaPipe (face), TensorFlow.js (segmentation)
- **Workers:** Web Workers for rendering & export
- **Storage:** IndexedDB (offline), PostgreSQL (SaaS)
- **PWA:** next-pwa

## Project Structure

```
src/
├── modules/
│   ├── upload/       # Person management & photo upload
│   ├── layout/       # Sheet arrangement & packing engine
│   ├── print/        # Print-safe margins, cut guides, DPI
│   ├── ai/           # Face detection, background removal
│   └── export/       # JPG/PNG/PDF/ZIP batch export
├── components/       # Shared UI components
├── hooks/            # Custom React hooks
├── stores/           # Zustand state management
├── utils/            # Helper utilities
└── workers/          # Web Worker threads
```

## License

MIT — Built by [Jitendra Kumar](https://github.com/igjitendra)
