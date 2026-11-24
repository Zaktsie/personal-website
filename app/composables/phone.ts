import type { AppsCollectionItem } from '@nuxt/content'

/** The subset of an app the phone mock needs (keeps it independent of the Markdown body type). */
export type PhoneApp = Pick<AppsCollectionItem, 'title' | 'path' | 'color' | 'icon' | 'platforms' | 'status' | 'tagline' | 'description' | 'stack' | 'github' | 'screenshots'>
