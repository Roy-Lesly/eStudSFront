import { uploadGraphQLMutation } from "./UploadGraphql";

type SubmitOptions = {
  newData: any;
  editData?: any;
  mutationName: string; // e.g., 'createUpdateDeleteCustomUser
  modelName: string;    // e.g., 'customuser'
  successField?: string; // e.g., 'username' or 'fullName'
  query: any;
  params: any;
  router: any;
  redirect: boolean;
  redirectPath: string;
  returnResponseField?: boolean;
  actionLabel?: "processing" | "creating" | "updating" | "deleting";
  reload?: boolean;
  getFileMap?: (item: any) => Record<string, File>; // file map callback
};

export const ApiFactory = async ({
  newData,
  editData,
  mutationName,
  modelName,
  successField = "title",
  query,
  router,
  params,
  reload = true,
  redirect,
  redirectPath,
  returnResponseField = false,
  actionLabel = "processing",
  getFileMap
}: SubmitOptions) => {
  const items = Array.isArray(newData) ? newData : [newData];
  const successMessages: string[] = [];
  const errorMessages: string[] = [];
  let responseFieldData: any = null;

  for (let index = 0; index < items.length; index++) {
    let res: any = items[index];
    if (editData?.id) {
      // res = { ...res, id: parseInt(decodeUrlID(editData.id)) };
    }
    

    try {
      const response = await uploadGraphQLMutation({
        query: query.loc?.source.body || "",
        variables: res,
        fileMap: getFileMap ? getFileMap(res) : {},
        params: params,
        token: localStorage.getItem("token") || "",
      });

      const result = response?.data?.[mutationName]?.[modelName];
      console.log(response);
      console.log(result);

      if (result?.id) {
        successMessages.push(result?.[successField] || "Unnamed item");
        if (returnResponseField) {
          responseFieldData = result?.[successField]
        }
      } else if (result === null) {
        successMessages.push("✅ Operation Successful");
      } else if (response?.errors?.[0]?.message?.includes("duplicate")) {
        errorMessages.push(`Record or File Already Exists ❌`);
      } else if (response?.errors?.[0]?.message?.includes("You can only upload")) {
        errorMessages.push(`You can Only Have Up to 5 Resumes ❌`);
      } else if (response?.errors?.[0]?.message?.includes("could not convert")) {
        errorMessages.push(`Check Form Data ❌`);
      } else if (response?.errors?.[0]?.message?.includes("Authentication")) {
        errorMessages.push(`Authentication Required ❌`);
      } else if (response?.errors?.[0]?.message?.includes("Cannot delete some instances of model")) {
        RelatedRecordPreventDelete(errorMessages, response?.errors?.[0]?.message)
      } else {
        ExtraErrorHandling(response, errorMessages)
      }
    } catch (err: any) {
      errorMessages.push(`Error ${actionLabel} ${res[successField] || ""}: ${err.message}`);
    }
  }

  let alertMessage = "";
  if (successMessages.length > 0) {
    alertMessage += `✅ Successfully Submitted`;
    if (returnResponseField) return responseFieldData;
    else if (redirect) { router.push(redirectPath); }
    else if (reload) { window.location.reload(); }
  }
  if (errorMessages.length > 0) {
    alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
  }
  alert(alertMessage);
};



const RelatedRecordPreventDelete = (errorMessages: any, rawMsg: any) => {
  const match = rawMsg.match(/model '(\w+)'[^']+'(\w+)\.(\w+)'[^<]*<(.+)>/);

  if (match) {
    const model = match[1];
    const relatedModel = match[2];
    // const relatedField = match[3];
    const relatedItems = match[4]
      .split('>, <')
      .map((item: any) => item.replace(/[{}<>]/g, '').trim());

    errorMessages.push(
      `❌ Cannot delete ${model} because it is still used in ${relatedModel}:`
      // `❌ Cannot delete ${model} because it is still used in ${relatedModel}.${relatedField}:`
    );
    relatedItems.forEach((item: any) => {
      errorMessages.push(`- ${item}`);
    });
  } else {
    errorMessages.push("❌ Deletion failed due to existing related records.");
  }
}


export const ExtraErrorHandling = (response: any, errorMessages: any) => {

  if (response.errors && response.errors.length > 0) {
    response.errors.forEach((error: any) => {
      try {
        const jsonString = error.message.replace(/'/g, '"');
        const errorObj = JSON.parse(jsonString);

        if (typeof errorObj === 'object' && errorObj !== null) {
          for (const [field, messages] of Object.entries(errorObj)) {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                errorMessages.push(`${field}: ${msg}`);
              });
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
        } else {
          errorMessages.push(error.message);
        }
      } catch (e) {
        // If parsing fails, push the raw message
        errorMessages.push(error.message);
      }
    });
  }
}