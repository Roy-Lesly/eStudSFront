export type TestResult = {
  name: string;
  type: string;
  status: boolean;
  detail: string;
};

export type AppReport = {
  appName: string;
  passed: number;
  failed: number;
  total: number;
  results: TestResult[];
};


export type CountByDomain = {
    domainName: string;
    specialties: number;
    courses: number;
    userProfiles: number;
};

export type CountBySpecialty = {
    specialtyName: string;
    level: number;
    courses: number;
    userProfiles: number;
};

export type TotalCountsByAcademicYearAndSchool = {
    domains: CountByDomain[];
    specialties: CountBySpecialty[];
};


export type TransactionTotalsByDomain = {
    balanceIdCharges: number;
    balancePlatformCharges: number;
    balanceRegistration: number;
    balanceTuition: number;
    count: number;
    domainName: string;
    expectedIdCharges: number;
    expectedPlatformCharges: number;
    expectedRegistration: number;
    expectedTuition: number;
    idCharges: number;
    platformCharges: number;
    registration: number;
    scholarship: number;
    tuition: number;
};


export type TransactionTotalsBySpecialty = {
    balanceIdCharges: number;
    balancePlatformCharges: number;
    balanceRegistration: number;
    balanceTuition: number;
    count: number;
    specialtyName: string;
    specialtyId: number;
    level: number;
    expectedIdCharges: number;
    expectedPlatformCharges: number;
    expectedRegistration: number;
    expectedTuition: number;
    idCharges: number;
    platformCharges: number;
    registration: number;
    scholarship: number;
    tuition: number;
};


export type TransactionTotalsByStudent = {
    fullName: string;
    specialtyName: string;
    academicYear: string;
    specialtyId: number;
    level: number;
    paid: boolean;
    balance: number;
    platformPaid: number;
    registration: number;
    tuition: number;
    scholarship: number;
    platformCharges: number;
    idCharges: number;
    balanceTuition: number;
    balanceRegistration: number;
};




//TRANSCRIPT
export interface ResultTranscript {
    semester: string;
    courseCode: string;
    courseCredit: number;
    courseName: string;
    ca: number;
    exam: number;
    resit: number;
    average: number;
    WP: number;
    GP: number;
    GD: string;
    hasResit: boolean;
}

export interface TransPerSemester {
    semester: string;
    semTotalCredit: number;
    semAttemptedCredit: number;
    semCreditEarned: number;
    semGP: number;
    gpaTotal: number;
}

export interface TransGeneral {
    gradeSystem: string;
    gpaTotal: number;
    totalAttempted: number;
    totalEarned: number;
    GPA: number;
}

export interface ResultTranscriptAverages {
    perSemester: TransPerSemester[];
    general: TransGeneral;
}

export interface AllResponseTranscript {
    resultTranscript: ResultTranscript[];
    resultTranscriptAverages: ResultTranscriptAverages;
}


export interface SpecialtyAndSchoolInfo {
    schoolName: string,
    schoolEmail: string,
    schoolTelephone: string,
    schoolPoBox: string,
    schoolCountry: string,
    schoolRegion: string,
    schoolNiu: string,
    schoolLogo: string,
    specialtyName: string,
    specialtyAcademicYear: string,
    specialtyLevel: string,
    fieldName: string,
    domainName: string,
}


export interface ResultDataSpecialtyTranscript {
  profileId: number;
  profileCode: string;
  fullName: string;
  matricle: string;
  dob: string;
  pob: string;
  program: string;
  platform: string;
  general: TransGeneral;
  perSemester: TransPerSemester[];
  results: ResultTranscript[];
}

export interface CombinedResultDataSpecialtyTranscript {
  resultDataSpecialtyTranscript: ResultDataSpecialtyTranscript[];
  specialtyAndSchoolInfo: SpecialtyAndSchoolInfo;
}