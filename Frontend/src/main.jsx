import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global error handler to catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Filter out browser extension errors
  const errorMessage = event.reason?.message || '';
  if (errorMessage.includes('message channel closed') || 
      errorMessage.includes('asynchronous response')) {
    // This is a browser extension error, ignore it
    event.preventDefault();
    return;
  }
});

// Global error handler for regular errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  if (errorMessage.includes('message channel closed') || 
      errorMessage.includes('asynchronous response')) {
    // This is a browser extension error, ignore it
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
