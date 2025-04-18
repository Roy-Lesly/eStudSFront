// export const protocol = "http://"
// export const RootApi = ".localhost:8000"
// export const NoDomainRootApi = "localhost:8000"

export const protocol = "https://"
export const RootApi = ".e-conneq.com"
export const NoDomainRootApi = "e-conneq.com"



import { TimeSlotsList } from "./constants"

export const TenantUrl = "https://e-conneq.com/tenant/tenant"
export const GetTenantUrl = "http://e-conneq.com/tenant/get-tenant"
export const TenantDomainUrl = "http://e-conneq.com/tenant/domain"
export const GetTenantDomainUrl = "http://e-conneq.com/tenant/get-domain"



export const ConfigData: any = {
    local: {
        school: "test",
        contact_number: "693358642",
        landing_page: ["E-CONNEQ", "TESTING SCHOOLS"],
        logo_main512: "/images/logo/LogoEconneq.png", logo_main256: "/images/logo/LogoEconneq.png",
        bg: {
            transcript: "/images/transcript/bg-trans-e-conneq.png",
            slip: "/images/transcript/bg-slip-e-conneq.png",
        },
        higher: {
            landing_message: ["Welcome To", "E-CONNEQ HIGHER TESTING INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus_geolocations: {
                "Campus-A": [2.953624, 9.916485], "Campus-B": [2.953624, 9.916485], "Campus-C": [2.953393, 9.916840], "Campus-D": [2.953393, 9.916840]
            }
        },
        secondary: {
            landing_message: ["Welcome To", "E-CONNEQ SECONDARY TESTING INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [25, 50, 70, 95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus_geolocations: {
                A: [2.953624, 9.916485], B: [2.953624, 9.916485], C: [2.953393, 9.916840]
            },
            timeslots: [ "08:00", "12:00", "13:00", "17:00", "21:00"],
        },
    },
    schooltest: {
        school: "test",
        contact_number: "693358642",
        landing_page: ["E-CONNEQ", "TESTING SCHOOLS"],
        logo_main512: "/images/logo/LogoEconneq.png", logo_main256: "/images/logo/LogoEconneq.png",
        bg: {
            transcript: "/images/transcript/bg-trans-e-conneq.png",
            slip: "/images/transcript/bg-slip-e-conneq.png",
        },
        higher: {
            landing_message: ["Welcome To", "E-CONNEQ HIGHER TESTING INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus_geolocations: [
                { name: "Campus-A", geo: [4.047988, 9.725763], location: "Camrail" },
                { name: "Campus-B", geo: [4.091598, 9.660658], location: "Bonaberi" },
                { name: "Campus-C", geo: [4.084286, 9.745666], location: "Bonamoussadi" },
                { name: "Campus-D", geo: [4.047988, 9.725763], location: "Dschang" },
            ]
        },
        secondary: {
            landing_message: ["Welcome To", "E-CONNEQ SECONDARY TESTING INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [25, 50, 70, 95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus_geolocations: {
                "Campus-A": [2.953624, 9.916485], "Campus-B": [2.953624, 9.916485], "Campus-C": [2.953393, 9.916840], "Campus-D": [2.953393, 9.916840]
            }
        },
    },
    test: {
        school: "test",
        contact_number: "693358642",
        landing_page: ["Welcome To", "E-CONNEQ SCHOOLS"],
        logo_main512: "/images/logo/LogoEconneq.png", logo_main256: "/images/logo/LogoEconneq.png",
        bg: {
            transcript: "/images/transcript/bg-trans-e-conneq.png",
            slip: "/images/transcript/bg-slip-e-conneq.png",
        },
        higher: {
            landing_message: ["Welcome To", "E-CONNEQ HIGHER TESTING INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1", registration_seperate_tuition: true,
            schoolfees_control: [0.50, 0.80, 0.95, 0.96, 0.97, 0.99],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus: [
                { name: "Campus-A", geolocation: [4.068917, 9.742502], radius: 60, time_interval: 1, location: "Camrail", },
                // { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 60, time_interval: 1, location: "Camrail", },
                { name: "Campus-B", geolocation: [2.9536859, 9.9164863], radius: 50, time_interval: 2, location: "Kribi Office",},
                // { name: "Campus-B", geolocation: [2.952438, 9.915545], radius: 60, time_interval: 2, location: "Kribi House",},
                { name: "Campus-C", geolocation: [4.084286, 9.745666], radius: 40, time_interval: 1, location: "Bonamoussadi", },
                { name: "Campus-D", geolocation: [4.047988, 9.725763], radius: 70, time_interval: 2, location: "Dschang", },
            ],
            timeSlots: TimeSlotsList[1]
        },
        secondary: {
            landing_message: ["Welcome To", "E-CONNEQ COLEGE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "TEST", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [25, 50, 70, 95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus: [
                { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 60, time_interval: 1, location: "Camrail", },
            ]
        },
    },
    joan: {
        school: "St Joan",
        contact_number: "693358642",
        landing_page: ["Welcome To", "ST JOAN SCHOOLS"],
        logo_main512: "/images/logo/LogoJoan.png", logo_main256: "/images/logo/LogoJoan.png",
        bg: {
            transcript: "/images/transcript/bg-trans-joan.png",
            slip: "/images/transcript/bg-slip-joan.png",
        },
        higher: {
            landing_message: ["Welcome To", "ST JOAN HIGHER INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "SAJOHIMMS", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.375, 0.75, 0.75, 0.75, 0.98, 1],     // OK
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoJoan.png", logo256: "/images/logo/LogoJoan.png",
            campus: [
                { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 60, time_interval: 1, location: "Yaounde Etoug-Ebe", },
            ],
            timeSlots: TimeSlotsList[1]
        },
    },
    brains: {
        school: "test",
        contact_number: "693358642",
        landing_page: ["Welcome To", "THE BRAINS SCHOOLS"],
        logo_main512: "/images/logo/LogoBrains.png", logo_main256: "/images/logo/LogoBrains.png",
        bg: {
            transcript: "/images/transcript/bg-trans-brains.png",
            slip: "/images/transcript/bg-slip-brains.png",
        },
        higher: {
            landing_message: ["Welcome To", "THE BRAINS UNIVERSITY"], help_number: "693358642",
            ca_mark: 19.9, exam_mark: 29.9, ca_limit: 40.0, exam_limit: 60.0, resit_limit: 60.0,
            prefix: "TBU", method: "2",
            registration_seperate_tuition: true,
            schoolfees_control: [0.50, 0.80, 0.95, 0.96, 0.97, 0.99],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoBrains.png", logo256: "/images/logo/LogoBrains.png",
            campus: [
                { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 60, time_interval: 1, location: "BP CITE", },
                { name: "Campus-B", geolocation: [4.091598, 9.660658], radius: 50, time_interval: 2, location: "BONABERI", },
                { name: "Campus-C", geolocation: [4.084286, 9.745666], radius: 40, time_interval: 1, location: "BONAMOUSSADI", },
                { name: "Campus-D", geolocation: [4.047988, 9.725763], radius: 50, time_interval: 2, location: "DSCHANG", },
            ],
            timeSlots: TimeSlotsList[1]
        },
    },
    kings: {
        school: "Kings University",
        contact_number: "693358642",
        landing_page: ["Welcome To", "KINGS SCHOOLS"],
        logo_main512: "/images/logo/LogoKings.png", logo_main256: "/images/logo/LogoKings.png",
        bg: {
            transcript: "/images/transcript/bg-trans-kings.png",
            slip: "/images/transcript/bg-slip-kings.png",
        },
        higher: {
            landing_message: ["KINGS HIGHER", "INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "KHI", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.5, 0.75, 0.75, 0.75, 0.98, 1],   // OK
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoKings.png", logo256: "/images/logo/LogoKings.png",
            campus: [
                { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 60, time_interval: 1, location: "LIMBE - Mile II", },
            ],
            timeSlots: TimeSlotsList[1]
        },
    },
    vishi: {
        school: "Vishi Schools",
        contact_number: "693358642",
        landing_page: ["Welcome To", "VISHI SCHOOLS"],
        logo_main512: "/images/logo/LogoVishi.png", logo_main256: "/images/logo/LogoVishi.png",
        bg: {
            transcript: "/images/transcript/bg-trans-vishi.png",
            slip: "/images/transcript/bg-slip-vishi.png",
        },
        higher: {
            landing_message: ["VISHI HIGHER", "INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "VHI", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.85, 0.95, 1],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoVishi.png", logo256: "/images/logo/LogoVishi.png",
            campus: [
                { name: "Campus-A", geolocation: [4.091598, 9.660658], radius: 100, time_interval: 1, location: "Bonaberi - Nestle", },
            ],
            timeSlots: TimeSlotsList
        },
        secondary: {
            landing_message: ["Welcome To", "THE VISHI COLEGE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "VHI", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.95],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoVishi.png", logo256: "/images/logo/LogoVishi.png",
            campus: {
                "Campus-A": [2.953624, 9.916485], "Campus-B": [2.953624, 9.916485], "Campus-C": [2.953393, 9.916840], "Campus-D": [2.953393, 9.916840]
            }
        },
    },
    clings: {
        school: "Clings Schools",
        contact_number: "693358642",
        landing_page: ["Welcome To", "CLINGS SCHOOLS"],
        logo_main512: "/images/logo/LogoClings.png", logo_main256: "/images/logo/LogoClings.png",
        bg: {
            transcript: "/images/transcript/bg-trans-clings.png",
            slip: "/images/transcript/bg-slip-clings.png",
        },
        higher: {
            landing_message: ["CLINGS", "TECH ACADEMY"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "CTA", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.85, 0.95, 1],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoClings.png", logo256: "/images/logo/LogoClings.png",
            campus: [
                { name: "Campus-A", geolocation: [4.0501248, 9.7419264], radius: 50, location: "Bonaberi", time_interval: 1 },
            ],
            timeSlots: TimeSlotsList
        },
    },
    stjohn: {
        school: "Saint John's Schools",
        contact_number: "693358642",
        landing_page: ["Welcome To", "Saint John's Schools"],
        logo_main512: "/images/logo/LogoStJohn.png", logo_main256: "/images/logo/LogoStJohn.png",
        bg: {
            transcript: "/images/transcript/bg-trans-stjohn.png",
            slip: "/images/transcript/bg-slip-stjohn.png",
        },
        higher: {
            landing_message: ["Saint John's", "HIGHER INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "SJH", method: "2",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.85, 0.95, 1],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoStJohn.png", logo256: "/images/logo/LogoStJohn.png",
            campus: [              
                { name: "Campus-A", geolocation: [4.047988, 9.725763], radius: 50, time_interval: 1, location: "New Town Airport" },
            ],
            timeSlots: TimeSlotsList
        },
    },
    patrick: {
        school: "cohimms",
        contact_number: "693358642",
        landing_page: ["Patricks Systems"],
        logo_main512: "/images/logo/LogoEconneq.png", logo_main256: "/images/logo/LogoEconneq.png",
        bg: {
            transcript: "/images/transcript/bg-trans-cohims.png",
            slip: "/images/transcript/bg-slip-cohimms.png",
        },
        higher: {
            landing_message: ["Welcome To", "COVENANT HIGHER INSTITUTE"], help_number: "693358642",
            ca_mark: 14.9, exam_mark: 35.9, ca_limit: 30.0, exam_limit: 70.0, resit_limit: 60.0,
            prefix: "COHIMMS", method: "1",
            registration_seperate_tuition: true,
            schoolfees_control: [0.25, 0.50, 0.70, 0.85, 0.95, 1],
            color_1: "bg-teal-700", color_2: "bg-teal-50", color_3: "", color_4: "",
            logo512: "/images/logo/LogoEconneq.png", logo256: "/images/logo/LogoEconneq.png",
            campus: [
                { name: "Campus-A", geolocation: [4.0286564, 9.7688841], radius: 60, location: "Douala - Ndogpassi", time_interval: 1 },
            ],
            timeSlots: TimeSlotsList
        },
    },
}


