import React from 'react';
import IDCardGenerator from './Display';


const logo = '/images/logo/LogoEconneq.png'
const schoolName = 'BEST CHOICE UNIVERSITY INSTITUTE'
const specialty = 'NETWORK AND SECURITY'

const students = [
    { schoolName, logo, matricle: 'BU24ST005', name: 'NGAH-NGEHZE LORATEL URIEL', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student1.jpg' },
    { schoolName, logo, matricle: 'BU24ST001', name: 'TAMBE LIONEL ARREYA', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student5.jpg' },
    { schoolName, logo, matricle: 'BU24ST002', name: 'ARETOUYAP FADIMATOU', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student2.jpg' },
    { schoolName, logo, matricle: 'BU24ST003', name: 'TAMBE LIONEL ARREY', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student3.jpg' },
    { schoolName, logo, matricle: 'BU24ST004', name: 'Zane Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student4.jpg' },
    { schoolName, logo, matricle: 'BU24ST006', name: 'TAMBE LIONEL ARREY', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student1.jpg' },
    { schoolName, logo, matricle: 'BU24ST007', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student2.jpg' },
    { schoolName, logo, matricle: 'BU24ST008', name: 'Laurel Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student3.jpg' },
    { schoolName, logo, matricle: 'BU24ST009', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student4.jpg' },
    { schoolName, logo, matricle: 'BU24ST010', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student1.jpg' },
    { schoolName, logo, matricle: 'BU24ST011', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/student5.jpg' },
];
const page = () => {
    return (
        <IDCardGenerator students={students} />
    );
}

export default page;
