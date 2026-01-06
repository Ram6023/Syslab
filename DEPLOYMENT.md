# Deployment Guide - Engineer's Control Panel

## Quick Start (Localhost)

### Development Mode

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://0.0.0.0:5173 (accessible from other devices on your network)

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
# or
npm run serve
```

Production build will be in the `dist/` directory.

## Features

✅ All 5 modules fully functional
✅ Smooth animations and parallax effects
✅ Custom cursor
✅ Optimized build with code splitting
✅ No lint errors
✅ Production-ready

## Module Status

1. ✅ **CPU Scheduler** - 6 algorithms implemented
2. ✅ **Memory Manager** - 3 page replacement algorithms
3. ✅ **Network Simulator** - TCP-like protocol simulation
4. ✅ **Compiler Playground** - Lexer, parser, AST, interpreter
5. ✅ **Database Engine** - B-Tree indexing and query engine

## Performance Optimizations

- Code splitting (React vendor, UI vendor chunks)
- Throttled scroll and mouse events
- Memoized calculations
- Optimized re-renders
- Production minification

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors
The project uses TypeScript with relaxed settings for faster development. All runtime code is correct.

## Next Steps

1. Run `npm run dev` to start development server
2. Open http://localhost:5173 in your browser
3. Explore all 5 modules
4. Test simulations and visualizations
5. Export metrics as JSON

Enjoy exploring the Engineer's Control Panel! 🚀
