# Zutok Softwares - React.js Version

This is the React.js version of the original Next.js project. The conversion was done to transform the Next.js application into a pure React.js application.

## Changes Made

1. **Removed Next.js Specific Code**:
   - Removed `use client` directive
   - Replaced Next.js Image component with regular HTML img tags
   - Removed Next.js specific imports and components
   - Removed Next.js specific configuration files

2. **Updated Project Structure**:
   - Created standard React.js structure with src/ and public/ directories
   - Moved components to appropriate React structure
   - Updated import paths to work with React

3. **Dependencies**:
   - Removed Next.js dependencies
   - Added React and ReactDOM
   - Added Lucide React for icons
   - Configured Tailwind CSS for styling

4. **Routing**:
   - Since this is a single page application, no routing was needed
   - All content is in the main App.js file

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Features

The React.js version maintains all the functionality of the original Next.js version:

- Responsive design with mobile navigation
- Animated elements and interactive components
- Particle system background effects
- Smooth scrolling navigation
- Pricing cards and feature sections
- Testimonials and contact information

## Dependencies

- React.js
- Lucide React (for icons)
- Tailwind CSS (for styling)

## File Structure

```
react-app/
├── public/
│   ├── images/
│   │   └── zutok-logo.png
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Notes

- The application uses Tailwind CSS for styling, similar to the original Next.js version
- All animations and interactive elements have been preserved
- The logo image is properly referenced in the public folder
- The application is fully responsive and works on mobile devices