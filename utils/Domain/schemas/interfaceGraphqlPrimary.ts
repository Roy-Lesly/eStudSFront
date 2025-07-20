import { NodeCustomUser, NodeProgram, NodeSchoolIdentification, NodeSchoolInfoHigher } from "./interfaceGraphql";

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

export interface NodeUserProfilePrim {
  id: string;
  customuser: NodeCustomUser;
  series: NodeSeries[];
  classroomprim: NodeClassRoomPrim;
  programprim: NodeProgramPrim;
  infoData: string | any;
  session: string;
  active: false;
}


export interface NodeSeries {
  id: string;
  name: string;
  classroom: string;
  subjects: { edges: EdgeMainSubject[] };
}

export interface NodeProgramPrim {
  id: string;
  name: string;
  description: string;
}


export interface NodeClassRoomPrim {
  id: string;
  school: NodeSchoolInfoHigher;
  stream: string;
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
  mainsubjectprim: NodeMainSubject;
  classroomprim: NodeClassRoomPrim;
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


export interface NodeResultPrimary {
  id: string;
  student: NodeUserProfilePrim // Represents the "student" ForeignKey
  subjectprim: NodeSubject | null; // Represents the "subject" ForeignKey
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
  classroomsec: NodeClassRoomPrim;
  publishTerm: "I" | "II" | "III"; // Restricted to the defined term choices
  portalSeq: Record<string, boolean>; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  publishSeq: Record<string, boolean>; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  updatedAt: string;
  updatedBy: NodeCustomUser;
}


export interface EdgeTransactionsPrimSet {
  edges: {
    node: {node: NodeTransactionsPrim};
  }[];
}

export interface SetTransactionsSet { id: string, status: string, amount: number, reason: string, paymentMethod: string, ref: string, createdAt: string }
export interface NodeSchoolFeesPrim {
  id: string;
  userprofileprim: NodeUserProfilePrim;
  platformPaid: boolean,
  idPaid: boolean,
  balance: number,
  transactionsprim: SetTransactionsSet[];
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

export interface NodeTransactionsPrim {
  id: string;
  schoolfeesprim: NodeSchoolFeesPrim;
  amount: number,
  reason: string,
  status: string,
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

export interface NodePreInscriptionPrim {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  matricle: string;
  dob: string;
  pob: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  campus: NodeSchoolInfoHigher;
  fatherName: string;
  motherName: string;
  fatherTelephone: string;
  motherTelephone: string;
  parentAddress: string;
  about: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  status: string;
  admissionStatus: boolean;
  program: NodeProgram;
  academicYear: string;
  level: string;
  session: string;
}
















export interface EdgePreInscriptionPrim {
  node: NodePreInscriptionPrim;
}


export interface EdgeUserProfilePrim {
  node: NodeUserProfilePrim;
}

export interface EdgeSeries {
  node: NodeSeries;
}


export interface EdgeClassRoomPrim {
  node: NodeClassRoomPrim;
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

export interface EdgeResultPrimary {
  node: NodeResultPrimary;
}

export interface EdgeSchoolFeesPrim {
  node: NodeSchoolFeesPrim;
}

export interface EdgeTransactionsPrim {
  node: NodeTransactionsPrim;
}




export interface AllSeries {
  allSeries: {
    edges: EdgeSeries[];
    pageInfo: PageInfo;
  };
}

