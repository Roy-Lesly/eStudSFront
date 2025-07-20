"use client";

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AccessGuardProps {
  children: ReactNode;
  statusMoratoire: string
  respectPayment: boolean
}

const MoratoireCheck = ({ children, statusMoratoire = "Pending", respectPayment = false }: AccessGuardProps) => {
  
  const { t } = useTranslation("common");
  
  if (respectPayment && statusMoratoire === "Approved") {
    return <>{children}</>;
  }


  if (!respectPayment) {
    return <div>{t("Failed Agreement")}</div>;
  }

  return <div>{t("Not Approved Yet")}</div>;

};

export default MoratoireCheck;
