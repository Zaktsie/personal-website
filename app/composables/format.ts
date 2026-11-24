export function formatDate(value: string | Date, month: 'short' | 'long' = 'long') {
  return new Date(value).toLocaleDateString('en-ZA', { year: 'numeric', month, day: 'numeric' })
}

export function readingMinutes(raw?: string) {
  if (!raw) return 1
  return Math.max(1, Math.round(raw.split(/\s+/).length / 220))
}

export const platformLabel: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  backend: 'Backend',
}

export const statusLabel: Record<string, string> = {
  'shipped': 'Shipped',
  'in-development': 'In development',
  'archived': 'Archived',
}
