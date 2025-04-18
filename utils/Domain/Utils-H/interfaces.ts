export interface SelectedResultInter {
    id: number,
    student_id: number,
    course_id: number
    info: object,
    ca?: number | string
    exam?: number | string
    resit?: number | string
    created_by_id: number
    updated_by_id: number
}