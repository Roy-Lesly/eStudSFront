import { EdgeCourse, EdgeMainCourse, EdgeMainSpecialty, EdgeSchoolFees, EdgeSpecialty, EdgeUserProfile } from "./interfaceGraphql";


const flattenData = (
    edges: any[],
    type: "CustomUser" | "UserProfile" | "Specialty" | "MainSpecialty" | "MainCourse" | "Course" | "SchoolFees",
) => {
    let response: any[] = []

    if (type === "SchoolFees") {
        response = edges?.map((edge: EdgeSchoolFees, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                Matricle: node?.userprofile?.user?.matricle,
                "Full Name": node?.userprofile?.user?.fullName,
                Sex: node?.userprofile?.user?.sex,
                Address: node?.userprofile?.user?.address,
                Dob: node?.userprofile?.user?.dob,
                Pob: node?.userprofile?.user?.pob,
                Email: node?.userprofile?.user?.email,
                Telephone: node?.userprofile?.user?.telephone,
                Parent: node?.userprofile?.user?.parent,
                "Parent Telephone": node?.userprofile?.user?.parentTelephone,
                Session: node?.userprofile?.session,
                "Academic Year": node?.userprofile?.specialty?.academicYear,
                Level: node?.userprofile?.specialty?.level?.level,
                Program: node?.userprofile?.program?.name,
                Campus: node?.userprofile?.specialty?.school?.campus,
                Specialty: node?.userprofile?.specialty?.mainSpecialty?.specialtyName,
            };
        });
    }

    if (type === "UserProfile") {
        response = edges?.map((edge: EdgeUserProfile, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                Matricle: node?.user?.matricle,
                "Full Name": node?.user?.fullName,
                Sex: node?.user?.sex,
                Address: node?.user?.address,
                Dob: node?.user?.dob,
                Pob: node?.user?.pob,
                Email: node?.user?.email,
                Telephone: node?.user?.telephone,
                Parent: node?.user?.parent,
                "Parent Telephone": node?.user?.parentTelephone,

                Session: node?.session,
                "Academic Year": node?.specialty?.academicYear,
                Level: node?.specialty?.level?.level,
                Program: node?.program?.name,
                Campus: node?.specialty?.school?.campus,
                Specialty: node?.specialty?.mainSpecialty?.specialtyName,
            };
        });
    }


    if (type === "Specialty") {
        response = edges?.map((edge: EdgeSpecialty, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                SpecialtyName: node?.mainSpecialty?.specialtyName,
                AcademicYear: node?.academicYear,
                Level: node?.level?.level,
                Registration: node?.registration,
                Tuition: node?.tuition,
                PaymentOne: node?.paymentOne,
                PaymentTwo: node?.paymentTwo,
                PaymentThree: node?.paymentThree,
                campus: node?.school?.campus,
            };
        });
    }


    if (type === "MainSpecialty") {
        response = edges?.map((edge: EdgeMainSpecialty, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                SpecialtyName: node?.specialtyName,
            };
        });
    }


    if (type === "MainCourse") {
        response = edges?.map((edge: EdgeMainCourse, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                courseName: node?.courseName,
            };
        });
    }


    if (type === "Course") {
        response = edges?.map((edge: EdgeCourse, index: number) => {
            const node = edge.node;
            return {
                No: index + 1,
                CourseName: node?.mainCourse?.courseName,
                code: node?.courseCode,
                credit: node?.courseCredit,
                semester: node?.semester,
                type: node?.courseType,
                lecturer: node?.assignedTo?.fullName,
                hours: node?.hours,
                hoursLeft: node?.hoursLeft,
                campus: node?.specialty?.school?.campus,
            };
        });
    }


    return response
};


export default flattenData;