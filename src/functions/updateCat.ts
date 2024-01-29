import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  app,
} from '@azure/functions';
import { CatDocument, catDocumentSchema } from '../schema/cat';
import { ZodError } from 'zod';
import { container } from '../db/cosmos-client';

export async function updateCat(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const body: CatDocument = await request.json();
    const validatedCat: CatDocument = catDocumentSchema.parse(body);

    await container.items.upsert(validatedCat);

    return { status: 201, body: JSON.stringify(validatedCat) };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: 400,
        body: JSON.stringify(error.issues),
      };
    }
  }
}

app.http('updateCat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'cats',
  handler: updateCat,
});
