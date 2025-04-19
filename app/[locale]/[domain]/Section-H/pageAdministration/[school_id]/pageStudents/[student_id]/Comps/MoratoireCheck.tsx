"use client";

import { ReactNode } from "react";
import ActivationError from "@/ActivationError";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";

interface AccessGuardProps {
  children: ReactNode;
  statusMoratoire: string
  respectPayment: boolean
}

const MoratoireCheck = ({ children, statusMoratoire = "Pending", respectPayment = false }: AccessGuardProps) => {
  if (respectPayment && statusMoratoire === "Approved") {
    return <>{children}</>;
  }


  if (!respectPayment) {
    return <div>Failed Agreement</div>;
  }

  return <div>Not Approved Yet</div>;

};

export default MoratoireCheck;
