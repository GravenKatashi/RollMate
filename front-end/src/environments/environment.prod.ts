function getApiUrl(): string {
  if (typeof window !== 'undefined' && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  return `${protocol}//${hostname}/api`;
}

export const environment = {
  production: true,
  apiUrl: getApiUrl(),
  appName: 'RollMate',
  version: '1.0.0'
};
