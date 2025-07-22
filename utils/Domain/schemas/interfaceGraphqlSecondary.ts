import { NodeCustomUser, NodeProgram, NodeSchoolIdentification, NodeSchoolHigherInfo } from "./interfaceGraphql";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
}

export type TableColumn<T> = {
  header: string;
  accessor?: string;
  responsiveHidden?: boolean;
  hideColumn?: boolean;
  align: 'left' | 'center' | 'right';  // Valid values for alignment
  render?: (item: T, index: number) => React.ReactNode;  // Change the return type to React.ReactNode
};

export interface NodeUserProfileSec {
  id: string;
  customuser: NodeCustomUser;
  series: NodeSeries[];
  classroomsec: NodeClassRoomSec;
  program: NodeProgram;
  session: string;
  active: false;
  infoData: string;
}


export interface NodeSeries {
  id: string;
  name: string;
  classroom: string;
  subjects: { edges: EdgeMainSubject[] };
}


export interface NodeClassRoomSec {
  id: string;
  school: NodeSchoolHigherInfo;
  stream: string;
  cycle: string;
  level: string;
  select: boolean;
  option: string;
  academicYear: string;
  registration: number;
  tuition: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
}

export interface NodeMainSubject {
  id: string;
  subjectName: string;
}

export interface NodeSubjectSec {
  id: string;
  mainsubject: NodeMainSubject;
  classroomsec: NodeClassRoomSec;
  subjectCode: string;
  subjectType: string;
  subjectCoefficient: string;
  assigned: boolean;
  compulsory: boolean;
  dateAssigned: boolean;
  assignedTo: NodeCustomUser;
}


// export interface ResultInfo {
//   [key: string]: number | null; // Keys like "seq_1", "seq_2", etc., with numeric or null values
// }


export interface NodeResultSecondary {
  id: string;
  student: NodeUserProfileSec // Represents the "student" ForeignKey
  subjectsec: NodeSubjectSec | null; // Represents the "subject" ForeignKey
  infoData: string | any; // JSONField structure
  logs: string | any; // JSONField structure
  active?: true;
  createdAt?: string;
  createdBy?: NodeCustomUser;
  updatedAt?: string;
  updatedBy?: NodeCustomUser;
}


export interface NodePublishSecondary {
  id: string;
  classroomsec: NodeClassRoomSec;
  publishTerm: "I" | "II" | "III"; // Restricted to the defined term choices
  portalSeq: Record<string, boolean>; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  publishSeq: Record<string, boolean>; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  updatedAt: string;
  updatedBy: NodeCustomUser;
}


export interface EdgeTransactionsSecSet {
  edges: {
    node: { node: NodeTransactionsSec };
  }[];
}

export interface SetTransactionsSet { id: string, status: string, amount: number, reason: string, paymentMethod: string, ref: string, createdAt: string }
export interface NodeSchoolFeesSec {
  id: string;
  userprofilesec: NodeUserProfileSec;
  platformPaid: boolean,
  idPaid: boolean,
  balance: number,
  transactionssec: SetTransactionsSet[];
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

export interface NodeTransactionsSec {
  id: string;
  schoolfeesec: NodeSchoolFeesSec;
  amount: number,
  reason: string,
  status: string,
  updatedAt: string;
  updatedBy: NodeCustomUser;
}


















// Edge interface
export interface EdgeUserProfileSec {
  node: NodeUserProfileSec;
}

export interface EdgeSeries {
  node: NodeSeries;
}

export interface EdgeClassRoomSec {
  node: NodeClassRoomSec;
}

export interface EdgeMainSubject {
  node: NodeMainSubject;
}

export interface EdgeSubjectSec {
  node: NodeSubjectSec;
}

export interface EdgePublishSecondary {
  node: NodePublishSecondary;
}

export interface EdgeResultSecondary {
  node: NodeResultSecondary;
}

export interface EdgeSchoolFeesSec {
  node: NodeSchoolFeesSec;
}

export interface EdgeTransactionsSec {
  node: NodeTransactionsSec;
}





