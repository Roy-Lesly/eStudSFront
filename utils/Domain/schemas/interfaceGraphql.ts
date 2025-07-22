
// PageInfo interface
interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
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
  campus: NodeSchoolHigherInfo;
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
  specialtyOne: NodeMainSpecialty;
  specialtyTwo: NodeMainSpecialty;
  academicYear: string;
  level: string;
  session: string;
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
  title: string;
  fatherName: string;
  motherName: string;
  fatherTelephone: string;
  motherTelephone: string;
  parentAddress: string;
  about: string;
  isSuperuser: string;
  isStaff: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  infoData: string | any;
  isActive: boolean;
  password: string;
  passwordSet: boolean;
  createdAt: string;
}

// UserProfile interface
export interface NodeUserProfile {
  id: string;
  session: string;
  customuser: NodeCustomUser;
  specialty: NodeSpecialty;
  program: NodeProgram;
  code: string;
  infoData: string | any;
  schoolfees: { id: string, balance: number };
  moratoires: any;
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
  hasHigher: string;
  hasSecondary: string;
  hasPrimary: string;
  hasVocational: string;
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
  mainSchool: boolean;
  address: string;
  region: string;
  town: string;
  country: string;
  poBox: string;
  niu: string;
  website: string;
  latitude: number;
  longitude: number;
  landingMessageMain: string;
  logoCampus: string;
  registrationSeperateTuition: boolean;
  welcome_message: string;
  radius: number;
  email: string;
  telephone: string;
  campus: string;
  schoolfeesControl: string;
  seqLimit: number;
  caLimit: number;
  examLimit: number;
  resitLimit: number;
  bgLogoSlip: string;
  bgLogoTranscript: string;
  colors: string;
  welcomeMessage: string;
  emailNotification: boolean;
  smsNotification: boolean;
  waNotification: boolean;
}


// To be Deleted
export interface NodeSchoolInfoHigher {
  id: string;
  schoolIdentification: NodeSchoolIdentification;
  prefix: string;
  method: number;
  schoolType: string;
  schoolName: string;
  shortName: string;
  mainSchool: boolean;
  address: string;
  region: string;
  town: string;
  country: string;
  poBox: string;
  niu: string;
  website: string;
  latitude: number;
  longitude: number;
  landingMessageMain: string;
  logoCampus: string;
  registrationSeperateTuition: boolean;
  welcome_message: string;
  radius: number;
  email: string;
  telephone: string;
  campus: string;
  schoolfeesControl: string;
  seqLimit: number;
  caLimit: number;
  examLimit: number;
  resitLimit: number;
  bgLogoSlip: string;
  bgLogoTranscript: string;
  colors: string;
  welcomeMessage: string;
  emailNotification: boolean;
  smsNotification: boolean;
  waNotification: boolean;
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
  infoData: string | any; // JSONField structure
  logs: any; // JSONField structure
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
    node: { node: NodeTransactions };
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


export interface SetTransactions { id: string, status: string, amount: number, reason: string, paymentMethod: string, ref: string, createdAt: string }
export interface NodeSchoolFees {
  id: string | number;
  userprofile: NodeUserProfile,
  platformPaid: boolean;
  idPaid: boolean;
  balance: number;
  transactions: SetTransactions[];
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

export interface NodeAccount {
  id: string | number;
  name: string,
  year: string,
  status: boolean,
  description: string,
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

// To be deleted
export interface EdgeSchoolInfoHigher {
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

export interface EdgeAccount {
  node: NodeAccount;
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
    pageinfoData: PageInfo;
  };
}

export interface AllUserProfilesResponse {
  allUserProfiles: {
    edges: EdgeUserProfile[];
    pageinfoData: PageInfo;
  };
}

export interface AllLevelsResponse {
  allLevels: {
    edges: EdgeLevel[];
    pageinfoData: PageInfo;
  };
}

export interface AllDepartmentsResponse {
  allDepartments: {
    edges: EdgeDepartment[];
    pageinfoData: PageInfo;
  };
}

export interface AllProgramsResponse {
  allPrograms: {
    edges: EdgeProgram[];
    pageinfoData: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageinfoData: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageinfoData: PageInfo;
  };
}

export interface AllDomainsResponse {
  allDomains: {
    edges: EdgeDomain[];
    pageinfoData: PageInfo;
  };
}

export interface AllFieldsResponse {
  allFields: {
    edges: EdgeField[];
    pageinfoData: PageInfo;
  };
}

export interface AllMainSpecialtiesResponse {
  allMainSpecialties: {
    edges: EdgeMainSpecialty[];
    pageinfoData: PageInfo;
  };
}

export interface AllSpecialtiesResponse {
  allSpecialties: {
    edges: EdgeSpecialty[];
    pageinfoData: PageInfo;
  };
}

export interface AllMainCoursesResponse {
  allMainCourses: {
    edges: EdgeMainCourse[];
    pageinfoData: PageInfo;
  };
}

export interface AllCoursesResponse {
  allCourses: {
    edges: EdgeCourse[];
    pageinfoData: PageInfo;
  };
}



export interface NodeHall {
  id: string;
  name: string;
  floor: string;
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

