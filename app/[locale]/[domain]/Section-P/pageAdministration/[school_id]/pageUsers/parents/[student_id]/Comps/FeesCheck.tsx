"use client";

import { ReactNode } from "react";
import ActivationErrorSec from "@/components/ActivationErrorSec";
import { NodeSchoolFeesPrim } from "@/utils/Domain/schemas/interfaceGraphqlPrimary";
import ActivationErrorPrim from "@/components/ActivationErrorPrim";

interface AccessGuardProps {
  children: ReactNode;
  fees: NodeSchoolFeesPrim
  term: number;
  link?: string;
  emptyComp?: boolean;
}

const FeesCheck = ({ children, term, fees, link, emptyComp }: AccessGuardProps) => {
  console.log(fees);
  const schoolfeesControl = fees?.userprofileprim.classroomprim.school.schoolfeesControl.split(",").map(Number);
  const tuition = fees?.userprofileprim.classroomprim.tuition
  const paidAmount = fees?.userprofileprim?.classroomprim.tuition - fees?.balance

  
  if ((paidAmount / tuition) > schoolfeesControl[term-1]) {
    return <>{children}</>;
  }

  if (emptyComp) { return <div></div>}

  if (!fees?.platformPaid) {
    return <ActivationErrorPrim
      fees={fees}
      type="platform"
      link={link}
    />;
  }

  return <ActivationErrorPrim
    fees={fees}
    type="fees"
    link={link}
  />;

};

export default FeesCheck;
