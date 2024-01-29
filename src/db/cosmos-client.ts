import { CosmosClient, CosmosClientOptions } from "@azure/cosmos";

const cosmosAccount = process.env.CosmosDbConnectionString;
if (!cosmosAccount) {
    throw new Error('Missing CosmosDbConnectionString');
}

const cosmosOptions: CosmosClientOptions = {
    endpoint: cosmosAccount.split(';')[0].split('=')[1],
    key: cosmosAccount.split(';')[1].split('=')[1],
}

const cosmosClient = new CosmosClient(cosmosOptions);

export const container = cosmosClient.database('CatsDb').container('CatsContainer');

