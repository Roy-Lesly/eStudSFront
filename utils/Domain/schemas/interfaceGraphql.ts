import { StaticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

// PageInfo interface
interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
}


interface NodeInfo {
  [key: string]: number | null; // Keys like "ca", "exam", etc., with numeric or null values
}


export interface NodeTenant {
  id: string;
  schemaName: string;
  schoolName: string;
  schoolType: string;
  isActive: boolean;
  domains: {
    edges: {
      node: {
        id: string;
        domain: string;
      };
    }[];
  };
  user: NodeCustomUser;
}

export interface NodeTenantDomain {
  id: string;
  domain: string;
  isPrimary: boolean;
  tenant: NodeTenant;
}

// PreInscription interface
export interface NodePreInscription {
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
  campus: string;
  emergency: string;
  emergencyTelephone: string;
  about: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtain: string;
}

// User interface
export interface NodeCustomUser {
  id: string;
  prefix: string;
  photo: string;
  role: string;
  matricle: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  dob: string;
  pob: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  parent: string;
  parentTelephone: string;
  about: string;
  isSuperuser: string;
  isStaff: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  createdAt: string;
}

// UserProfile interface
export interface NodeUserProfile {
  id: string;
  session: string;
  user: NodeCustomUser;
  specialty: NodeSpecialty;
  program: NodeProgram;
  code: string;
  info: NodeInfo;
}

// Level interface
export interface NodeLevel {
  id: string,
  level: string;
}

// Department interface
export interface NodeDepartment {
  id: string,
  name: string;
}

// Program interface
export interface NodeProgram {
  id: string,
  name: string;
  description: string;
}


// SchoolIdentification interface
export interface NodeSchoolIdentification {
  id: string;
  logo: string;
  code: string;
  version: string;
  director: string;
  name: string;
  supportNumberOne: string;
  supportNumberTwo: string;
  status: boolean;
  platformCharges: number;
  idCharges: number;
  lastName: string;
  messageOne: string;
  messageTwo: string;
  backEnd: string;
  frontEnd: string;
}

// School interface
export interface NodeSchoolHigherInfo {
  id: string;
  schoolIdentification: NodeSchoolIdentification;
  prefix: string;
  method: number;
  schoolType: string;
  schoolName: string;
  shortName: string;
  address: string;
  region: string;
  town: string;
  country: string;
  poBox: string;
  niu: string;
  website: string;
  latitude: number;
  longitude: number;
  logo: string;
  registrationSeperateTuition: boolean;
  welcome_message: string;
  radius: number;
  email: string;
  telephone: string;
  campus: string;
  schoolfeesControl: string;
  caLimit: number;
  examLimit: number;
  resitLimit: number;
  bgLogoSlip: string;
  bgLogoTranscript: string;
  colors: string;
}

// Domain interface
export interface NodeDomain {
  id: string;
  domainName: string;
}


// Field interface
export interface NodeField {
  id: string;
  fieldName: string;
  domain: NodeDomain;
}

// MainSpecialty interface
export interface NodeMainSpecialty {
  id: string;
  specialtyName: string;
  specialtyNameShort: string;
  field: NodeField;
}

// Specialty interface
export interface NodeSpecialty {
  id: string;
  mainSpecialty: NodeMainSpecialty,
  academicYear: string;
  resultType: string;
  level: NodeLevel;
  school: NodeSchoolHigherInfo;
  tuition: number;
  registration: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
}

// MainCourse interface
export interface NodeMainCourse {
  id: string;
  courseName: string;
}

// Course interface
export interface NodeCourse {
  id: string;
  mainCourse: NodeMainCourse,
  specialty: NodeSpecialty;
  assignedTo: NodeCustomUser
  percentageCa: number;
  percentageResit: number;
  percentageExam: number;
  courseCode: string;
  courseType: string;
  courseCredit: number;
  semester: string;
  hours: number;
  hoursLeft: number;
  assigned: boolean;

  countTotal: number
  countSubmittedCa: number
  countSubmittedExam: number
  countSubmittedResit: number
  countValidated: number
  countFailed: number
  countResit: number
  countMissingAverage: number
  countWithAverage: number
}


export interface NodeResult {
  id: string;
  student: NodeUserProfile,
  course: NodeCourse,
  info: NodeInfo | any; // JSONField structure
  logs: any; // JSONField structure
  ca: number
  exam: number
  resit: number
  average: number
}

// Publish interface
export interface NodePublish {
  id: string | number;
  semester: "I" | "II";
  specialty: NodeSpecialty,
  portalCa: boolean
  portalExam: boolean
  portalResit: boolean
  ca: boolean
  exam: boolean
  resit: boolean
}






export interface EdgeTransactionsSet {
  edges: {
    node: {node: NodeTransactions};
  }[];

}


export interface Milestone {
  amount: number;
  dueDate: string; 
}

export interface NodeMoratoire {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  comment?: string;
  requestedSchedule?: Milestone[];
  approvedSchedule?: Milestone[];
  reviewedBy?: string;
  reviewedAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  userprofile: NodeUserProfile;
}

export interface NodeSchoolFees {
  id: string | number;
  userprofile: NodeUserProfile,
  platformPaid: boolean;
  idPaid: boolean;
  balance: number;
  transactionsSet: EdgeTransactionsSet;
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

// Transactions interface
export interface NodeTransactions {
  id: string | number;
  schoolfees: NodeSchoolFees,
  payerName: string,
  telephone: string,
  status: boolean,
  paymentMethod: string,
  account: string,
  reason: string,
  ref: string,
  operationType: string,
  origin: string,
  amount: number,
  operator: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

// TranscriptApplications interface
export interface NodeTranscriptApplications {
  id: string | number;
  userprofile: NodeUserProfile,
  printCount: number,
  status: "PENDING" | "APPROVED" | "PRINTED",
  approvedBy: NodeCustomUser,
  approvedAt: string,
  printedBy: NodeCustomUser,
  printedAt: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

// TranscriptApplications interface
export interface NodeSysCategory {
  id: string | number;
  name: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

// TranscriptApplications interface
export interface NodeSysConstant {
  id: string | number;
  sysCategory: NodeSysCategory
  name: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}















export interface EdgeTenant {
    node: NodeTenant;
};


export interface EdgeTenantDomain {
    node: NodeTenantDomain;
};



// Edge interface
export interface EdgePreInscription {
  node: NodePreInscription;
}

export interface EdgeCustomUser {
  node: NodeCustomUser;
}

export interface EdgeUserProfile {
  node: NodeUserProfile;
}

export interface EdgeLevel {
  node: NodeLevel;
}

export interface EdgeDepartment {
  node: NodeDepartment;
}

export interface EdgeProgram {
  node: NodeProgram;
}

export interface EdgeSchoolIdentification {
  node: NodeSchoolIdentification;
}

export interface EdgeSchoolHigherInfo {
  node: NodeSchoolHigherInfo;
}

export interface EdgeDomain {
  node: NodeDomain;
}

export interface EdgeField {
  node: NodeField;
}

export interface EdgeMainSpecialty {
  node: NodeMainSpecialty;
}

export interface EdgeSpecialty {
  node: NodeSpecialty;
}

export interface EdgeMainCourse {
  node: NodeMainCourse;
}

export interface EdgeCourse {
  node: NodeCourse;
}

export interface EdgeResult {
  node: NodeResult;
}

export interface EdgePublish {
  node: NodePublish;
}

export interface EdgeMoratoire {
  node: NodeMoratoire;
}

export interface EdgeSchoolFees {
  node: NodeSchoolFees;
}

export interface EdgeTransactions {
  node: NodeTransactions;
}

export interface EdgeTranscriptApplications {
  node: NodeTranscriptApplications;
}

export interface EdgeSysCategory {
  node: NodeSysCategory;
}

export interface EdgeSysConstants {
  node: NodeSysConstant;
}




  


// Query response interface
export interface AllCustomUsersResponse {
  allCustomUsers: {
    edges: EdgeCustomUser[];
    pageInfo: PageInfo;
  };
}

export interface  AllUserProfilesResponse {
  allUserProfiles: {
    edges: EdgeUserProfile[];
    pageInfo: PageInfo;
  };
}

export interface AllLevelsResponse {
  allLevels: {
    edges: EdgeLevel[];
    pageInfo: PageInfo;
  };
}

export interface AllDepartmentsResponse {
  allDepartments: {
    edges: EdgeDepartment[];
    pageInfo: PageInfo;
  };
}

export interface AllProgramsResponse {
  allPrograms: {
    edges: EdgeProgram[];
    pageInfo: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageInfo: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageInfo: PageInfo;
  };
}

export interface AllDomainsResponse {
  allDomains: {
    edges: EdgeDomain[];
    pageInfo: PageInfo;
  };
}

export interface AllFieldsResponse {
  allFields: {
    edges: EdgeField[];
    pageInfo: PageInfo;
  };
}

export interface AllMainSpecialtiesResponse {
  allMainSpecialties: {
    edges: EdgeMainSpecialty[];
    pageInfo: PageInfo;
  };
}

export interface AllSpecialtiesResponse {
  allSpecialties: {
    edges: EdgeSpecialty[];
    pageInfo: PageInfo;
  };
}

export interface AllMainCoursesResponse {
  allMainCourses: {
    edges: EdgeMainCourse[];
    pageInfo: PageInfo;
  };
}

export interface AllCoursesResponse {
  allCourses: {
    edges: EdgeCourse[];
    pageInfo: PageInfo;
  };
}



export interface NodeHall {
  id: number;
  name: string;
  capacity: number;
  school: NodeSchoolHigherInfo;
}

export interface EdgeHall {
  node: NodeHall
}

export interface Slot {
  assignedToId: number;
  assignedToName: string;
  status: "Pending" | "LoggedIn" | "LoggedOut" | "Completed" | "Suspended";
  start: string;
  end: string;
  hours: number;
  courseId: number;
  courseName: string;
  session: string;
  hall: string;

  byId: number;
  byName: string;
  loginTime: string;
  logoutTime: string;
  duration: number;
  hallUsed: string;
  remarks: string;
}

export interface Period {
  date: string;
  slots: Slot[];
}


export interface NodeTimeTable {
  id: string;
  specialty: NodeSpecialty;
  year: number;
  month: number;
  monthName: string;
  published: boolean;
  period: Period[];
}

export interface EdgeTimeTable {
  node: NodeTimeTable;
}

