// Represents school Info
export interface TypeTransSchoolInfo {
  eng: boolean;
  ministry: string;
  schoolCountry: string;
  schoolEmail: string;
  schoolLogo: string;
  schoolName: string;
  schoolNiu: string;
  schoolPoBox: string;
  schoolRegion: string;
  schoolTown: string;
  schoolTelephone: string;
  schoolDirector: string;
}

// Represents student Info
export interface TypeTransStudentInfo {
    userprofileId: string;
    matricle: string;
    fullName: string;
    pob: string;
    dob: string;
    domain: string;
    field: string;
    specialtyName: string;
    academicYear: string;
    level: string;
    program: string;
}

// Represents TranscriptInfo
export interface TypeTranscriptInfo {
  schoolInfo: TypeTransSchoolInfo;
  studentInfo: TypeTransStudentInfo;
}




// Represents a single course within a semester
export interface TypeTranscriptCourse {
  academicYear: string;
  semester: string;
  courseCode: string;
  courseCredit: number;
  courseName: string;
  average: number;
  ca: number;
  exam: number;
  resit: number | null;
  GP: number;
  GD: string;
  WP: number;
  CV: number;
  hasResit: boolean;
}

// Represents the results of a single semester
export interface SemesterResults {
  academicYear: string;
  level: string;
  semester: string;
  courses: TypeTranscriptCourse[];
  semesterGPA: number;
  semesterCreditAttempted: number;
  semesterCreditEarned: number;
}

// Represents the results of an academic year, including all semesters
export interface TypeProfileResults {
  academicYear: string;
  level: number;
  semesters: SemesterResults[];
  yearGPA: number;
  yearCreditAttempted: number;
  yearCreditEarned: number;
  gpaSystem: string;
}
