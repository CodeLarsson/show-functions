import { z } from 'zod';

export const catDocumentSchema = z
  .object({
    name: z.string(),
    breed: z.string(),
    favouriteFood: z.string(),
    accepsBellyRubs: z.boolean(),
    age: z.number(),
    image: z.string().optional(),
    description: z.string().optional(),
    adopted: z.boolean(),
    id: z.string().optional(),
  })
  .strict();

export type CatDocument = z.infer<typeof catDocumentSchema>;

export const catDocumentKeys: Array<keyof CatDocument> = [
  'accepsBellyRubs',
  'age',
  'breed',
  'description',
  'favouriteFood',
  'image',
  'name',
  'adopted',
  'id',
];
