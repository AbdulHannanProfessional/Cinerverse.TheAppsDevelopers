export function createPageUrl(path = '') {
  if (!path) return '/';
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

export function cn(...values) {
  return values.filter(Boolean).join(' ');
}
