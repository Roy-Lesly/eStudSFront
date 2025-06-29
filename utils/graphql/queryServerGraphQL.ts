// lib/serverGraphQL.ts

import { ApolloClient, NormalizedCacheObject, DocumentNode } from "@apollo/client";
import getApolloClient, { errorLog } from "./GetAppolloClient";

type ServerQueryOptions = {
  query: DocumentNode;
  domain: string;
  variables?: Record<string, any>;
};

export async function queryServerGraphQL<T = any>({
  query,
  domain,
  variables = {},
}: ServerQueryOptions): Promise<T | null> {
  try {
    const client: ApolloClient<NormalizedCacheObject> = getApolloClient(domain);
    const result = await client.query<T>({
      query,
      variables,
    });
    return result.data as T; // ✅ Type assertion here
  } catch (error: any) {
    errorLog(error);
    return null;
  }
}
