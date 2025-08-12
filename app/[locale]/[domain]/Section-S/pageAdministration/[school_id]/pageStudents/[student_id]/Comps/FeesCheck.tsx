"use client";

import { ReactNode } from "react";
import { NodeSchoolFeesSec } from "@/utils/Domain/schemas/interfaceGraphqlSecondary";
import ActivationErrorSec from "@/components/ActivationErrorSec";

interface AccessGuardProps {
  children: ReactNode;
  fees: NodeSchoolFeesSec
  term: number;
  link?: string;
  emptyComp?: boolean;
}

const FeesCheck = ({ children, term, fees, link, emptyComp }: AccessGuardProps) => {
  console.log(fees);
  const schoolfeesControl = fees?.userprofilesec.classroomsec.school.schoolfeesControl.split(",").map(Number);
  const tuition = fees?.userprofilesec.classroomsec.tuition
  const paidAmount = fees?.userprofilesec?.classroomsec.tuition - fees?.balance

  if (!fees?.platformPaid) {
    return <ActivationErrorSec
      fees={fees}
      type="platform"
      link={link}
    />;
  }
  else if ((paidAmount / tuition) > schoolfeesControl[term - 1]) {
    return <>{children}</>;
  }

  else if (emptyComp) { return <div></div> }

  else {
    return <ActivationErrorSec
      fees={fees}
      type="fees"
      link={link}
    />
  };

};

export default FeesCheck;
