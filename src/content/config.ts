import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    category: z.string().default('digital'),
    affiliateProducts: z.array(z.string()).optional(),
    focusKeyword: z.string().optional(),
    seoTitle: z.string().optional(),
  }),
});

export const collections = { blog };
