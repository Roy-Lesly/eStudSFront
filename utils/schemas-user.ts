import { z } from "zod";


const arraySchema = z.number().optional()

export const DepartmentSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
})

export const ProgramSchema = z.object({
    id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    name: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
})

export const SchemaCreateEditCustomUser = z.object({
    id: z.coerce.number().optional(),
    username: z.string().optional(),
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    full_name: z.string().optional(),
    sex: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    address: z.string().trim().min(1, { message: "Must Contain 6 Characters Minimum"}),
    email: z.string().trim().min(1, { message: "Must Contain 6 Characters Minimum"}),
    role: z.string().trim().min(1, { message: "Must Contain 2 Characters Minimum"}),
    telephone: z.coerce.number().optional(),
    parent_name: z.string().trim().optional(),
    parent_telephone: z.coerce.number().optional(),
    title: z.string().optional(),
    prefix: z.string().optional(),
    pob: z.string().optional(),
    dob: z.string().optional(),
    is_active: z.boolean().optional(),
    dept: z.array(arraySchema).optional(),
    school: z.array(arraySchema).optional(),
    page: z.array(arraySchema).optional(),
})


export const SchemaCreateEditPreIncription = z.object({
    id: z.string().optional(),
    registration_number: z.string().optional(),
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    full_name: z.string().optional(),
    sex: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    email: z.string().trim().min(1, { message: "Must Contain 6 Characters Minimum"}),
    telephone: z.coerce.number().optional(),
    address: z.string().optional(),
    pob: z.string(),
    dob: z.string(),
    emergency_name: z.string().trim().optional(),
    emergency_town: z.string().trim().optional(),
    emergency_telephone: z.coerce.number().optional(),
    specialty_one: z.string().optional(),
    specialty_two: z.string().optional(),
    academic_year: z.string().optional(),
    session: z.string().optional(),
    level: z.coerce.number(),
    program: z.string().optional(),
    campus: z.string(),
    admission_status: z.boolean().optional(),
    action: z.enum(["CREATING", "UPDATING", "VERIFYING", "ADMISSION"]),
    status: z.enum(["PENDING", "ADMITTED"]),

})

export const SchemaEditCustomUser = z.object({
    id: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    username: z.string().trim().min(3, { message: "Must Contain 3 Characters Minimum"}),
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    email: z.string().trim().min(6, { message: "Must Contain 6 Characters Minimum"}),
    role: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum"}),
    sex: z.string().optional(),
    title: z.string().optional(),
    is_active: z.boolean().optional(),
    telephone: z.coerce.number().optional(),
    // dept_id: z.array(arraySchema)
    // dept_id: z.array(DepartmentSchema).optional()
})

export const SchemaCreateEditUserProfile = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain user Id"}),
    specialty_id: z.coerce.number().min(1, { message: "Must Contain Specialty Id"}),
    program_id: z.coerce.number().min(1, { message: "Must Contain Program Id"}),
    session: z.string().trim().min(4, { message: "Must Contain Session Id"}),
    active: z.boolean().optional(),
})

export const UserProfileStudentEditSchema = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    specialty_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    program_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
    session: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
})

export const UserProfileLectAdminEditSchema = z.object({
    user_id: z.coerce.number().min(1, { message: "Must Contain 1 Characters Minimum"}),
})

