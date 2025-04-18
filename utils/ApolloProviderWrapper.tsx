"use client";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { useParams } from "next/navigation";
import { protocol, RootApi } from "./config";

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const params = useParams();

  const API_LINK = `${protocol}${params.tenant_name ? params.tenant_name : `api${params.domain}`}${RootApi}/graphql/`;

  const client = new ApolloClient({
    uri: API_LINK,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
