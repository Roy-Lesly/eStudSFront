import { NodeCustomUser } from "./interfaceGraphql";

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

export interface NodeUserprofileSec {
  id: string;
  user: NodeCustomUser;
  series: NodeSeries[];
  classroom: NodeClassRoom;
  program: NodeProgramSec;
  session: string;
  code: string;
  active: false;
}


export interface NodeSeries {
  id: string;
  name: string;
  subjects: { edges: EdgeMainSubject[] };
}

export interface NodeProgramSec {
  id: string;
  name: string;
  description: string;
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

export interface NodeSecondaryLevel {
  id: string;
  level: string;
}

export interface NodeClassRoom {
  id: string;
  school: NodeSchoolInfoSecondary;
  stream: string;
  level: NodeSecondaryLevel;
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
  classroom: NodeClassRoom;
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
  student: NodeUserprofileSec // Represents the "student" ForeignKey
  subject: NodeSubject | null; // Represents the "subject" ForeignKey
  info: ResultInfo; // JSONField structure
  active?: true;
  createdAt?: string;
  updatedAt?: string;
}


export interface NodePublishSecondary {
  id: string;
  classroom: NodeClassRoom;
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
  userprofilesec: NodeUserprofileSec;
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
export interface EdgeUserprofileSec {
  node: NodeUserprofileSec;
}

export interface EdgeSeries {
  node: NodeSeries;
}

export interface EdgeProgramSec {
  node: NodeProgramSec;
}

export interface EdgeSchoolIdentificationSecondary {
  node: NodeSchoolIdentificationSecondary;
}

export interface EdgeSchoolInfoSecondary {
  node: NodeSchoolInfoSecondary;
}

export interface EdgeSecondaryLevel {
  node: NodeSecondaryLevel;
}

export interface EdgeClassRoom {
  node: NodeClassRoom;
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







// Query response interface
export interface AllUserprofileSec {
  allUserprofileSec: {
    edges: EdgeUserprofileSec[];
    pageInfo: PageInfo;
  };
}

export interface AllSeries {
  allSeries: {
    edges: EdgeSeries[];
    pageInfo: PageInfo;
  };
}

export interface AllProgramSec {
  allProgramSec: {
    edges: EdgeProgramSec[];
    pageInfo: PageInfo;
  };
}

export interface AllSchoolIdentificationSecondary {
  allSchoolIdentification: {
    edges: EdgeSchoolIdentificationSecondary[];
    pageInfo: PageInfo;
  };
}

export interface AllSchoolInfoSecondary {
  allSchoolInfoSecondarys: {
    edges: EdgeSchoolInfoSecondary[];
    pageInfo: PageInfo;
  };
}

export interface AllSecondaryLevel {
  allSecondaryLevels: {
    edges: EdgeSecondaryLevel[];
    pageInfo: PageInfo;
  };
}

export interface AllClassRoom {
  allClassRooms: {
    edges: EdgeClassRoom[];
    pageInfo: PageInfo;
  };
}

export interface AllMainSubject {
  allMainSubjects: {
    edges: EdgeMainSubject[];
    pageInfo: PageInfo;
  };
}

export interface AllSubject {
  allSubjects: {
    edges: EdgeSubject[];
    pageInfo: PageInfo;
  };
}

export interface AllPublishSecondarysResponse {
  allCourses: {
    edges: EdgePublishSecondary[];
    pageInfo: PageInfo;
  };
}

export interface AllSchoolFeesSecResponse {
  allSchoolFeesSec: {
    edges: EdgeSchoolFeesSec[];
    pageInfo: PageInfo;
  };
}

export interface AllTransactionsSecResponse {
  allTransactionsSec: {
    edges: EdgeTransactionsSec[];
    pageInfo: PageInfo;
  };
}