"use client";

import { ReactNode } from "react";
import ActivationError from "@/ActivationError";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";

interface AccessGuardProps {
  children: ReactNode;
  fees: EdgeSchoolFees
  semester: string;
  link?: string;
  emptyComp?: boolean;
}

const FeesCheck = ({ children, semester, fees, link, emptyComp }: AccessGuardProps) => {
  const schoolfeesControl = fees.node.userprofile.specialty.school.schoolfeesControl.split(",").map(Number);
  const tuition = fees.node.userprofile.specialty.tuition
  const paidAmount = fees.node.userprofile.specialty.tuition - fees.node.balance
  const control = semester === "I" ? schoolfeesControl[1] : schoolfeesControl[4]

  if (fees.node.balance == 0 || (tuition * control) < (paidAmount + 1)) {
    return <>{children}</>;
  }

  if (emptyComp) { return <div></div>}

  if (!fees.node.platformPaid) {
    return <ActivationError
      fees={fees}
      type="platform"
      link={link}
    />;
  }

  return <ActivationError
    fees={fees}
    type="fees"
    link={link}
  />;

};

export default FeesCheck;
