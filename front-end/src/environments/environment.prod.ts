// Production environment configuration
// API URL is determined dynamically based on the current hostname
// This allows the same build to work with different domains/IPs
function getApiUrl(): string {
  // Check if API_URL is provided via environment variable (for Docker builds)
  if (typeof window !== 'undefined' && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }
  
  // Fallback: Use same origin for API (if backend is on same domain)
  // Or use the current hostname with port 8000
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  
  // If accessing via HTTPS, use HTTPS for API
  if (protocol === 'https:') {
    return `${protocol}//${hostname}/api`;
  }
  
  // For HTTP, check if we need a different port
  // In production, backend might be on same domain or different port
  return `${protocol}//${hostname}:8000/api`;
}

export const environment = {
  production: true,
  apiUrl: getApiUrl(),
  appName: 'RollMate',
  version: '1.0.0'
};

