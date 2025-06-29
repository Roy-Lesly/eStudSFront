"use client";

import { ReactNode } from "react";
import I18nProvider from "@/i18nProvider";
import ApolloProviderWrapper from "@/utils/graphql/ApolloProviderWrapper";


interface ClientLayoutProps {
  locale: string;
  resources: Record<string, any>;
  children: ReactNode;
}

const ClientLayout = ({ locale, resources, children }: ClientLayoutProps) => {
  
  return (
    <ApolloProviderWrapper>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <I18nProvider locale={locale} translations={resources}>
          {children}
        </I18nProvider>
      </div>
    </ApolloProviderWrapper>
  );
}


export default ClientLayout