import React from 'react';
import IDCardGenerator from './Display';


const logo = '/images/logo/LogoEconneq.png'
const schoolName = 'BEST CHOICE PRIMARY SCHOOL'
const specialty = 'CLASS 4'

const students = [
    { schoolName, logo, matricle: 'BU24ST005', name: 'NGAH-NGEHZE LORATEL URIEL', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary1.jpg' },
    { schoolName, logo, matricle: 'BU24ST001', name: 'TAMBE LIONEL ARREYA', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary2.jpg' },
    { schoolName, logo, matricle: 'BU24ST002', name: 'ARETOUYAP FADIMATOU', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary3.jpg' },
    { schoolName, logo, matricle: 'BU24ST003', name: 'TAMBE LIONEL ARREY', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary7.jpg' },
    { schoolName, logo, matricle: 'BU24ST004', name: 'Zane Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary9.jpg' },
    { schoolName, logo, matricle: 'BU24ST006', name: 'TAMBE LIONEL ARREY', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary2.jpg' },
    { schoolName, logo, matricle: 'BU24ST007', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary4.jpg' },
    { schoolName, logo, matricle: 'BU24ST008', name: 'Laurel Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary6.jpg' },
    { schoolName, logo, matricle: 'BU24ST009', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary8.jpg' },
    { schoolName, logo, matricle: 'BU24ST010', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary5.jpg' },
    { schoolName, logo, matricle: 'BU24ST011', name: 'Bob Smith', dob: "1999-09-23", level: 100, pob: "DOUALA", academicYear: "2024/2025", specialty, photo: '/images/idcards/primary1.jpg' },
];
const page = () => {
    return (
        <IDCardGenerator students={students} />
    );
}

export default page;
