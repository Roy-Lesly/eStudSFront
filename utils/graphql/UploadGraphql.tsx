import { RootApi, protocol } from "../config";
import { Subdomains } from "../dataSource";


type UploadGraphQLArgs = {
  query: string;
  variables: Record<string, any>;
  fileMap: Record<string, File>;
  token?: string;
  params: any;
};

export async function uploadGraphQLMutation({
  query,
  variables,
  fileMap,
  token,
  params
}: UploadGraphQLArgs) {
  const formData = new FormData();
  const updatedVariables = { ...variables };
  Object.keys(fileMap).forEach((key) => {
    updatedVariables[key] = null;
  });

  const operations = {
    query,
    variables: updatedVariables,
  };

  const map: Record<string, string[]> = {};
  const fileKeys = Object.keys(fileMap);
  fileKeys.forEach((key, index) => {
    map[`${index}`] = [`variables.${key}`];
  });

  formData.append("operations", JSON.stringify(operations));
  formData.append("map", JSON.stringify(map));

  fileKeys.forEach((key, index) => {
    formData.append(`${index}`, fileMap[key]);
  });


  let root = RootApi

  const subdomain = params?.domain;
  let subdomainData = Subdomains.find(d => d.subdomain === subdomain);
  if (!subdomainData) {
    console.log("No Valid Subdomain");
    return
  }


  const API_LINK = `${protocol}api${subdomain}${root}/graphql/`;

  const res = await fetch(API_LINK, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();
  return data;
}
