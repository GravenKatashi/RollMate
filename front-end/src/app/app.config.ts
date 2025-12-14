// src/app/app.config.ts

// Dynamically determine API URL based on current hostname
// This allows the same code to work on desktop (localhost) and mobile (IP address)
function getApiUrl(): string {
  // Get the current hostname (localhost or IP address)
  const hostname = window.location.hostname;
  
  // If accessing via localhost or 127.0.0.1, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000/api';
  }
  
  // Otherwise, use the same hostname (IP address) for API
  return `http://${hostname}:8000/api`;
}

export const environment = {
  production: false,

  // API URL for Laravel backend - dynamically determined
  apiUrl: getApiUrl(),

  // App info
  appName: 'My Attendance System',
  version: '1.0.0'
};
