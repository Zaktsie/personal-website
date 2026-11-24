export type TechFilter = { id: string, label: string, match?: RegExp }

// Each filter matches against app stacks/platforms and role tags/bullets.
export const techFilters: TechFilter[] = [
  { id: 'all', label: 'Everything' },
  { id: 'android', label: 'Android', match: /android|\bjava\b|hms|huawei|kotlin|telematics/i },
  { id: 'ios', label: 'iOS', match: /\bios\b|swift|iphone/i },
  { id: 'vue', label: 'Vue & Nuxt', match: /vue|nuxt|pinia/i },
  { id: 'php', label: 'Laravel & PHP', match: /php|laravel|symfony|sanctum/i },
  { id: 'firebase', label: 'Firebase', match: /firebase/i },
  { id: 'apis', label: 'APIs & integrations', match: /api|jira|sso|azure|maps|auth|mailchimp|prismic/i },
  { id: 'testing', label: 'Testing', match: /jest|testing|tested/i },
]
