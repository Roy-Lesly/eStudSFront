import { z } from "zod";


const arraySchema = z.number().optional()


export const SchemaCreateEditDepartment = z.object({
    name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaCreateEditDomain = z.object({
    id: z.number().optional(),
    domain_name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
})

export const SchemaCreateEditField = z.object({
    domain_id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    field_name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
})

export const SchemaCreateEditMainSpecialty = z.object({
    field_id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    specialty_name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    specialty_name_short: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaCreateEditSpecialty = z.object({
    id: z.number().optional(),
    school_id: z.string().trim().optional(),
    main_specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    academic_year: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    level_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    tuition: z.coerce.number().min(1, { message: "Must Contain Minimum 1000" }),
    registration: z.coerce.number().optional(),
    payment_one: z.coerce.number().optional(),
    payment_two: z.coerce.number().optional(),
    payment_three: z.coerce.number().optional(),
})

export const SchemaCreateEditMainCourse = z.object({
    course_name: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
})

export const SchemaCreateEditCourse = z.object({
    main_course_id: z.coerce.number().min(1, { message: "C.Title Must Contain 1 Characters Minimum" }),
    specialty_id: z.coerce.number().min(1, { message: "Class Must Contain 1 Characters Minimum" }),
    course_code: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    course_credit: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_type: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    semester: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    hours: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    hours_left: z.coerce.number().optional(),
    completed: z.boolean().optional(),
    paid: z.boolean().optional(),
    assigned: z.boolean().optional(),
    assigned_to_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    // date_assigned: z.string().optional(),

    domain_id: z.coerce.number().optional(),
    academic_year: z.string().optional(),
    level: z.string().optional(),

})

export const SchemaCreateEditResult = z.object({
    id: z.coerce.number().optional(),
    student_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    ca: z.coerce.number().optional(),
    exam: z.coerce.number().optional(),
    resit: z.coerce.number().optional(),
})

export const SchemaCreateEditPublish = z.object({
    id: z.coerce.number().optional(),
    specialty_id: z.coerce.number(),
    semester: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    ca: z.boolean().optional(),
    exam: z.boolean().optional(),
    resit: z.boolean().optional(),
    portal_ca: z.boolean().optional(),
    portal_exam: z.boolean().optional(),
    portal_resit: z.boolean().optional(),
    updated_by_id: z.coerce.number().optional(),
})

export const SchemaCreateEditLevel = z.object({
    level: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaCreateEditProgram = z.object({
    name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    description: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
})

export const SchemaAssignSpecialty = z.object({
    specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    program_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    studentID: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    domainID: z.coerce.number().min(1, { message: "Must Contain 0 Characters Minimum" }),
    academicYear: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    levelID: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
})


export const SchemaCreateEditSysCategory= z.object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
})

export const SchemaCreateEditSysConstant = z.object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    sys_category_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
})


export const SchemaCreateEditTimeTableWeek = z.object({
    id: z.coerce.number().optional(),
    year_week: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    specialty_id: z.coerce.number().optional(),
    publish: z.boolean().optional(),
})

export const SchemaCreateEditTimeTableDay = z.object({
    id: z.coerce.number().optional(),
    timetableweek_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    date: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    day: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
})

export const SchemaCreateEditTimeSlot = z.object({
    id: z.coerce.number().optional(),
    timetableday_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    course_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    title: z.string().optional(),
    start: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    end: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    session: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
    action: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    status: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum" }),
})


export const SchemaCreateEditAccount = z.object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(3, { message: "Must Select Acount Name" }),
    number: z.string().optional(),
    year: z.string().trim().min(3, { message: "Must Select Account Year" }),
    balance: z.coerce.number().optional(),
    status: z.boolean().optional()
})


export const SchemaCreateEditSchoolFees = z.object({
    id: z.coerce.number().optional(),
    userprofile_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    platform_paid: z.boolean(),
    id_paid: z.boolean(),
    balance: z.coerce.number().optional(),
})

export const SchemaCreateEditTransactions = z.object({
    id: z.coerce.number().optional(),
    schoolfees_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum" }),
    payment_method: z.string().trim().min(3, { message: "Must Select Payment Method" }),
    reason: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    operation_type: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    telephone: z.string().optional(),
    payer_name: z.string().trim().optional(),
    account: z.string().trim().optional(),
    ref: z.string().trim().optional(),
    operator: z.string().trim().optional(),
    amount: z.coerce.number().optional(),
    from_account: z.coerce.number().optional(),
    to_account: z.coerce.number().optional(),
    balance: z.coerce.number().optional(),
})

export const SchemaEditTransactions = z.object({
    id: z.coerce.number(),
}).merge(SchemaCreateEditTransactions)


export const SchemaTransactionCreate = z.object({
    schoolfees_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    amount: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    // telephone: z.coerce.number().min(9, { message: "Must Put Telephone number"}),
    telephone: z.coerce.number(),
    operator: z.string().trim().min(3, { message: "Must Select Payment Method"}),
    payment_method: z.string().trim().min(3, { message: "Must Select Payment Method"}),
    reason: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    status: z.string().optional(),
    origin: z.string().optional(),
    url: z.string().optional(),
})


export const SchemaTranscriptApplicationCreate = z.object({
    userprofile_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    print_count: z.coerce.number().min(0),
    status: z.enum(["PENDING", "APPROVED", "PRINTED"]),
})

export const SchemaTranscriptApplicationEditApprove = z.object({
    id: z.coerce.number(),
    approved_at: z.string(),
    approved_by_id: z.coerce.number(),
}).merge(SchemaTranscriptApplicationCreate)

export const SchemaTranscriptApplicationEditPrint = z.object({
    id: z.coerce.number(),
    printed_at: z.string(),
    printed_by_id: z.coerce.number(),
}).merge(SchemaTranscriptApplicationCreate)

export const SchemaAppearanceUpdate = z.object({
    id: z.coerce.number().min(1, { message: "Must Have and ID"}),
    user_id: z.coerce.number().min(1, { message: "Must Have and ID"}),
    lang: z.string().trim().min(2, { message: "Must Select a Language"}),
    dark_mode: z.string().trim().min(3, { message: "Must Select Dark Mode"}),
})

export const SchemaPlatformChargesCreate = z.object({
    telephone: z.coerce.number().min(10, { message: "Minimum 10"}),
    amount: z.coerce.number().min(5, { message: "Minimum 5"}),
    service: z.string().trim().min(3, { message: "Must Select Service"}),
});

export const SchemaCreateEditNotifiation = z.object({
    target: z.string().trim().min(3, { message: "Must Select Target Group"}),
    message_one: z.string().trim().max(255, { message: "Must Enter Message"}),
    message_two: z.string().trim().max(255, { message: "Must Enter Message"}),
    noti_type: z.string().trim().min(3, { message: "Must Select Notification Category"}),
    role: z.string().trim().min(3, { message: "Must Select Role"}),
    status: z.boolean().optional(),
    schools: z.array(arraySchema).optional(),
    specialty: z.array(arraySchema).optional(),
    domains: z.array(arraySchema).optional(),
    ending_at: z.string().optional(),
})





export type LoginZodType = z.infer<typeof SchemaCreateEditDomain>;