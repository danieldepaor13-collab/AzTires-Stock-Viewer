# AZtires Stock Viewer

A simple web application to view available stock from the AZtires inventory database.

## Features

- View only available stock (items with quantity > 0)
- Search functionality by brand, name, category, or description
- Shop selection (Az Tires or LJ Tires)
- Real-time data from Firebase Firestore
- Modern, responsive UI built with Material-UI

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Database

This app connects to the same Firebase Firestore database as the main AZtires inventory management app. It only displays items where `quantity > 0` (available stock).

