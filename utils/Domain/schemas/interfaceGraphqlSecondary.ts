import { NodeCustomUser, NodeProgram } from "./interfaceGraphql";

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
}


export interface NodeSeries {
  id: string;
  name: string;
  classroom: string;
  subjects: { edges: EdgeMainSubject[] };
}


export interface NodeSchoolIdentificationSecondary {
  id: string;
}

export interface NodeSchoolInfoSecondary {
  id: string;
  campus: string;
  school_identification: NodeSchoolIdentificationSecondary;
  seq_limit: number;
  exam_limit: number;
}

export interface NodeClassRoomSec {
  id: string;
  school: NodeSchoolInfoSecondary;
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

export interface NodeSubject {
  id: string;
  mainSubject: NodeMainSubject;
  classroomsec: NodeClassRoomSec;
  subjectCode: string;
  subjectType: string;
  subjectCoefficient: string;
  assigned: boolean;
  compulsory: boolean;
  dateAssigned: boolean;
  assignedTo: NodeCustomUser;
}


export interface ResultInfo {
  [key: string]: number | null; // Keys like "seq_1", "seq_2", etc., with numeric or null values
}


export interface NodeResultSecondary {
  id: string;
  student: NodeUserProfileSec // Represents the "student" ForeignKey
  subject: NodeSubject | null; // Represents the "subject" ForeignKey
  info: ResultInfo; // JSONField structure
  active?: true;
  createdAt?: string;
  updatedAt?: string;
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
    node: {node: NodeTransactionsSec};
  }[];
}

export interface NodeSchoolFeesSec {
  id: string;
  userprofilesec: NodeUserProfileSec;
  platformPaid: boolean,
  idPaid: boolean,
  balance: number,
  transactionssecSet: EdgeTransactionsSecSet;
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

export interface EdgeSchoolIdentificationSecondary {
  node: NodeSchoolIdentificationSecondary;
}

export interface EdgeSchoolInfoSecondary {
  node: NodeSchoolInfoSecondary;
}

export interface EdgeClassRoomSec {
  node: NodeClassRoomSec;
}

export interface EdgeMainSubject {
  node: NodeMainSubject;
}

export interface EdgeSubject {
  node: NodeSubject;
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





