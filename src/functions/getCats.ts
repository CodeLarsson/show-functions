import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { container } from '../db/cosmos-client';
import { CatDocument, catDocumentKeys } from '../schema/cat';
import { extractKeys } from '../utils/utils';

export async function getCats(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const { resources } = await container.items
      .query<CatDocument>({
        query: 'SELECT * FROM c',
      })
      .fetchAll();

    if (!resources || resources.length === 0) {
      return { status: 404, body: 'Cats not found' };
    }

    const dbCats: Array<CatDocument> = resources.map((resource) =>
      extractKeys(resource, catDocumentKeys),
    );

    return { status: 200, body: JSON.stringify(dbCats) };
  } catch (error) {
    return { status: 500, body: JSON.stringify(error) };
  }
}

app.http('getCats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'cats',
  handler: getCats,
});
