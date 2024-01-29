import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { container } from '../db/cosmos-client';
import { CatDocument, catDocumentKeys } from '../schema/cat';
import { extractKeys } from '../utils/utils';

export async function getCat(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const catId = request.params.id;

  if (!catId) {
    return { status: 400, body: 'Missing cat id' };
  }

  try {
    const { resources } = await container.items
      .query<CatDocument>({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: catId }],
      })
      .fetchAll();

    if (!resources || resources.length === 0) {
      return { status: 404, body: 'Cat not found' };
    }

    const dbCat: CatDocument = extractKeys(resources[0], catDocumentKeys);

    return { status: 200, body: JSON.stringify(dbCat) };
  } catch (error) {
    return { status: 500, body: JSON.stringify(error) };
  }
}

app.http('getCat', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'cats/{id}',
  handler: getCat,
});
