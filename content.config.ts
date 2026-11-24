import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    apps: defineCollection({
      type: 'page',
      source: 'apps/*.md',
      schema: z.object({
        tagline: z.string(),
        platforms: z.array(z.enum(['android', 'ios', 'web', 'backend'])),
        status: z.enum(['shipped', 'in-development', 'archived']),
        stack: z.array(z.string()),
        role: z.string().optional(),
        year: z.number().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        color: z.string().default('#2f5bea'),
        icon: z.string().optional(),
        playStore: z.string().url().optional(),
        appStore: z.string().url().optional(),
        github: z.string().url().optional(),
        url: z.string().url().optional(),
        screenshots: z.array(z.string()).default([]),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        rawbody: z.string(),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: 'data/experience.json',
      schema: z.object({
        work: z.array(z.object({
          title: z.string(),
          org: z.string(),
          location: z.string(),
          period: z.string(),
          description: z.string(),
          bullets: z.array(z.string()),
          tags: z.array(z.string()),
        })),
        education: z.array(z.object({
          degree: z.string(),
          school: z.string(),
          period: z.string(),
          highlights: z.array(z.string()),
        })),
      }),
    }),
    skills: defineCollection({
      type: 'data',
      source: 'data/skills.json',
      schema: z.object({
        certifications: z.array(z.object({ name: z.string(), issuer: z.string(), url: z.string().optional() })),
        honors: z.array(z.object({ name: z.string(), org: z.string() })),
        categories: z.array(z.object({ name: z.string(), skills: z.array(z.string()) })),
        languages: z.array(z.object({ name: z.string(), level: z.string() })),
      }),
    }),
    shelf: defineCollection({
      type: 'data',
      source: 'data/shelf.json',
      schema: z.object({
        items: z.array(z.object({
          kind: z.enum(['game', 'book']),
          title: z.string(),
          by: z.string(),
          status: z.enum(['now', 'favourite']),
          color: z.string(),
          note: z.string().optional(),
          platform: z.string().optional(),
        })),
      }),
    }),
  },
})
