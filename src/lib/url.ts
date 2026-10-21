export function nodeUrl(path: string): string {
  return `/tree/${path.split('/').map(encodeURIComponent).join('/')}`
}
