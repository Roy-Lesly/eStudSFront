import fs from "fs";
import path from "path";

export default async function initTranslations(locale: string, namespaces: string[]) {
  const translations: Record<string, any> = {};

  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
    locale = "en";
  }

  for (const ns of namespaces) {
    const filePath = path.join(process.cwd(), "public", "locales", locale, `${ns}.json`);
    
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      translations[ns] = JSON.parse(fileContent);
    } catch (error) {
      translations[ns] = {};
    }
  }

  return { 
    t: (key: string) => translations.common?.[key] || key, 
    resources: translations 
  };
}
