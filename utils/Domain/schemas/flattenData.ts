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
                Matricle: node?.userprofile?.customuser?.matricle,
                "Full Name": node?.userprofile?.customuser?.fullName,
                Sex: node?.userprofile?.customuser?.sex,
                Address: node?.userprofile?.customuser?.address,
                Dob: node?.userprofile?.customuser?.dob,
                Pob: node?.userprofile?.customuser?.pob,
                Email: node?.userprofile?.customuser?.email,
                Telephone: node?.userprofile?.customuser?.telephone,
                "Father Name": node?.userprofile?.customuser?.fatherName,
                "Mother Name": node?.userprofile?.customuser?.motherName,
                "Father Telephone": node?.userprofile?.customuser?.fatherTelephone,
                "Mother Telephone": node?.userprofile?.customuser?.motherTelephone,
                "Parent Address": node?.userprofile?.customuser?.parentAddress,
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
                Matricle: node?.customuser?.matricle,
                "Full Name": node?.customuser?.fullName,
                Sex: node?.customuser?.sex,
                Address: node?.customuser?.address,
                Dob: node?.customuser?.dob,
                Pob: node?.customuser?.pob,
                Email: node?.customuser?.email,
                Telephone: node?.customuser?.telephone,
                "Father Name": node?.customuser?.fatherName,
                "Mother Name": node?.customuser?.motherName,
                "Father Telephone": node?.customuser?.fatherTelephone,
                "Mother Telephone": node?.customuser?.motherTelephone,
                "Parent Address": node?.customuser?.parentAddress,

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