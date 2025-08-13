export const versionPresent = "3.0.0"


export const MonthList: { id: number, value: string }[] = [
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
    { id: 4, value: "April" },
    { id: 5, value: "May" },
    { id: 6, value: "June" },
    { id: 7, value: "July" },
    { id: 8, value: "August" },
    { id: 9, value: "September" },
    { id: 10, value: "October" },
    { id: 11, value: "November" },
    { id: 12, value: "December" }
]

export const monthMap: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

export const DayList: string[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",]
export const AccountTypesList: string[] = ["REGISTRATION", "TUITION", "SCHOLARSHIP"]

export const TimeSlotsList: string[][] = [
    [ "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
    [ "08:00", "10:00", "12:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
    [ "08:00", "12:00", "13:00", "17:00", "21:00"],
    [ "08:30", "10:00", "11:30", "13:30", "15:00", "16:30", "17:30", "19:00", "20:30"],
    [ "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
]

export const TableRowClassName = {
    all: "dark:even:bg-blue-300 even:bg-blue-200 hover:bg-slate-300",
    sm: "h-10",
    md: "h-12",
    lg: "h-14"
}

export const ConstAccountLists = [
    "REGISTRATION", "TUITION", "SCHOLARSHIP",
]

export const ListSecondaryLevel = [
    "FORM 1", "FORM 2", "FORM 3", "FORM 4", "FORM 5", "LOWERSIXTH", "UPPERSIXTH",
    "6eme", "5eme", "4eme",
]

export const ListSecondaryStream = [
    "GENERAL", "TECHNICAL", "COMMERCIAL",
]

export const ConstSpecialtyList = [
    "MEDICAL LABORATORY SCIENCES", "MIDWIFERY", "NURSING", "MEDICAL LABORATORY TECHNOLOGY", "PHARMACY TECHONOLOGY", "MEDICAL IMAGING TECHNOLOGY",
    "TECHNICIEN DE LABORATOIRE", "SAGE FEMME", "TECHNICIEN EN PHARMACIE", "ULTRASONOGRAPHY", "PHYSIOTHERAPY", "REPRODUCTIVE HEALTH", "DELEGUE MEDICALE",
    "KINÉSITHÉRAPIE", "SOINS INFIRMIERS", "RADIOLOGIE ET IMAGERIE", "NUTRITION ET DIÉTÉTIQUE", "AIDE SOIGNANTE", "HEALTH CARE MANAGEMENT", "DENTAL THERAPY",
    
    "TELECOMMUNICATION", "SOFTWARE ENGINEERING", "COMPUTER HANDWEAR MAINTENANCE", "NETWORK AND SECURITY", "INFORMATION SYSTEM MANAGEMENT", "DATABASE MANAGEMENT", 
    "GENIE CIVIL", "GENIE LOGICEL", "RESEAUX ET SECURITE", "CIVIL ENGINEERING TECHNOLOGY", "COMPUTER GRAPHICS AND WEB DESIGN", "ELECTRICAL POWER SYSTEM", "MECHANICAL MANUFACTURING", 
    "METAL CONSTRUCTION",
    
    "E-COMMERCE / DIGITAL MARKETING", "CUSTOM AND TRANSIT", "TOPOGRAPHY", "HOTEL MANAGEMENT AND CATERING", "TOURISM AND TRAVEL AGENCY MANAGEMENT",
    "PROJECT MANAGEMENT", "HUMAN RESOURCE MANAGEMENT", "BANKING AND FINANCE", "ACCOUNTANCY", "LOGISTIC AND TRANSPORT", "MARKETING", "PORT SHIPPING MANAGEMENT", 
    "INTERNATIONAL TRADE", "CORPORATE COMMUNICATION", "INSURANCE", "BUSINESS MANAGEMENT", "GESTION", "ASSISTANT MANAGER",
    
    "AGROPASTORAL ENGINEERING", "AGRICULTURAL BUSINESS", "INDUSTRIE ALIMENTAIRE", "CONSEILLER AGROPASTORAL", "PRODUCTION VÉGÉTABLE", "AQUACULTURE", 
    "FOOD TECHNOLOGY", "AGRICULTURAL PRODUCTION TECHNOLOGY","ANIMAL PRODUCTION", "CROP PRODUCTION", "PRODUCTION ANIMALE", 

    "BEAUTY ESTHETICS", "FASHION CLOTHING AND TEXTILE", "BAKERY AND FOOD PROCESSING", "OTHERS/AUTRE", "AUXILLAIRE EN PHARMACIE", "VENDEUR EN PHARMACY"
]
export const ConstProgramList = [
    "HND", "BTS", "BSC", "LICENSE", "MASTERS", "DOCTORAT", "PhD", "DPQ", "OND", "DQP"
]

export const CertificateOptions = [ 
    "Vocational", "GCE Ordinary Level", "B.E.P.C", "GCE Advanced Level", "Baccalaureat", 
    "HND", "BTS", "BACHELOR", "LICENCE", "MASTERS", "PHD", "DOCTORAT", "Other", 
];
export const RegionList = ["Littoral", "Center", "West", "South West", "South", "North West", "East", "Adamawa", "North", "Far North", "Other"]
