import { useState } from "react";
import { EdgeCourse, EdgeHall, EdgeTimeTable, NodeTimeTable, Period, Slot } from "@/Domain/schemas/interfaceGraphql";
import { decodeUrlID, formatDate } from "@/functions";
import TimeSlot from "./TimeSlot";
import { FaPlus } from "react-icons/fa";
import { monthMap } from "@/constants";
import { GrClose } from "react-icons/gr";
import { gql, useMutation } from "@apollo/client";
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";


const TimeTableCard = (
    { timetable, apiCourses, apiHalls }
        :
        { timetable: EdgeTimeTable, apiCourses: EdgeCourse[], apiHalls: EdgeHall[] }
) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedTimetable, setEditedTimetable] = useState<EdgeTimeTable>(timetable);

    const addPeriod = () => {
        const monthNumber = monthMap[editedTimetable.node.monthName];
        if (!monthNumber) {
            alert("Invalid month name.");
            return;
        }

        const daysInMonth = new Date(2025, monthNumber, 0).getDate(); // Get the last day of the month (e.g., 31 for January)

        const newDay = prompt(`Enter the day (1-${daysInMonth}):`);
        if (!newDay) return;

        const day = parseInt(newDay, 10);

        if (isNaN(day) || day < 1 || day > daysInMonth) {
            alert(`Please enter a valid day between 1 and ${daysInMonth}.`);
            return;
        }

        // Construct the full date string in YYYY-MM-DD format
        const fullDate = `2025-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;


        const existingPeriod = editedTimetable.node.period.find((p: Period) => p.date === fullDate);
        if (existingPeriod) {
            alert("This date already exists in the timetable.");
            return;
        }

        const newPeriod: Period = {
            date: fullDate,
            slots: [
                {
                    assignedToId: 0,
                    assignedToName: '',
                    courseId: 0,
                    courseName: '',
                    hall: '',
                    hours: 0,
                    start: '',
                    end: '',
                    session: 'Morning',
                    status: 'Pending',

                    byId: 0,
                    byName: "",
                    loginTime: "",
                    logoutTime: "",
                    duration: 0,
                    hallUsed: "",
                    remarks: "",
                },
            ],
        };

        setExpanded(fullDate)

        setEditMode(true);
        setEditedTimetable((prev: any) => ({
            ...prev,
            node: {
                ...prev.node,
                period: [
                    ...prev.node.period,
                    newPeriod,
                ].sort((a: Period, b: Period) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            },
        }));
    };

    const handleSlotUpdate: any = (updatedPeriod: Period, date: string) => {
        setEditedTimetable((prev: any) => ({
            ...prev,
            node: {
                ...prev.node,
                period: prev.node.period.map((p: Period) => p.date === date ? updatedPeriod : p),
            },
        }));
    };

    const [createUpdateDeleteTimeTable] = useMutation(CREATE_UPDATE_TIMETABLE)

    const handleSubmit = async () => {
        setLoading(true);
        if (editMode) {
            if (!validateSlots(editedTimetable)) {
                setLoading(false);
                return;
            }
            const dataToSubmit = formatData(editedTimetable.node)
            try {
                const result = await createUpdateDeleteTimeTable({
                    variables: {
                        ...dataToSubmit
                    }
                });
                if (result.data.createUpdateDeleteTimeTable.timetable.id) {
                    window.location.reload()
                };
            } catch (error: any) {
                alert(`error domain:, ${error}`)
            }

            setEditMode(false);
            setLoading(false);
        } else {
            setEditMode(true);
            setLoading(false);
        }
    };

    const removePeriod = (date: string) => {
        setEditedTimetable((prev) => ({
            ...prev,
            period: prev.node.period.filter((p) => p.date !== date),
        }));
    };


    const shouldRenderButton = (slots: Slot[]) => slots.every((slot) => !["Completed", "LoggedIn", "LoggedOut"].includes(slot.status));
    
    return (
        <div className="border rounded-lg shadow-lg p-2 bg-white text-black">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    📅 {editedTimetable.node?.year} - Month: {editedTimetable.node?.monthName}
                </h2>
                <div onClick={addPeriod} className="px-4 py-1 cursor-pointer flex gap-2 items-center rounded hover:bg-green-300">
                    <button
                        className="flex gap-2 items-center rounded-full bg-green-500 p-2 hover:bg-green-600"
                    >
                        <FaPlus color="white" size={22} />
                    </button>
                    Add Day
                </div>
                <button
                    className="text-2xl font-semibold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => { handleSubmit(); }}
                >
                    {!loading ? editMode ? "Save" : "Edit" : "Loading..."}
                </button>
            </div>

            {editedTimetable.node?.period.map((day: Period, index: any) => (
                <div key={index} className="mt-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setExpanded(expanded === day.date ? null : day.date)}
                            className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition duration-200"
                        >
                            <span className="font-semibold text-lg">📆 {formatDate(day.date)}</span>
                        </button>
                        <div className="flex justify-center items-center">

                            {shouldRenderButton(day.slots) && (
                                <button
                                onClick={() => removePeriod(day.date)}
                                className="transition duration-200"
                                >
                                    <GrClose size={36} color="red" className="bg-teal-50 hover:bg-blue-200 p-2 border-red border-2 rounded-full" />
                                </button>
                            )}
                        </div>
                    </div>

                    {expanded === day.date && (
                        <div className="mt-2">
                            <TimeSlot
                                slots={day.slots}
                                date={day.date}
                                editMode={editMode}
                                onUpdate={(updatedSlots: Slot[]) => handleSlotUpdate({ ...day, slots: updatedSlots }, day.date)}
                                apiCourses={apiCourses}
                                apiHalls={apiHalls}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TimeTableCard;


const formatData = (data: NodeTimeTable | any) => {

    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");
    let formatedData: any = {}
    formatedData = {
        specialtyId: data?.specialty?.id ? parseInt(decodeUrlID(data.specialty.id)) : parseInt(data.specialtyId.toString()),
        year: data.year,
        published: data?.published ? data?.published : false,
        month: monthMap[data.monthName],
        updatedById: user.user_id,
        period: data.period.map((period: Period) => {
            return {
                date: period.date,
                slots: period.slots.map((slot: Slot) => {
                    return {
                        assignedToId: slot.assignedToId,
                        assignedToName: slot.assignedToName,
                        byId: slot.byId,
                        byName: slot.byName,
                        courseId: slot.courseId,
                        courseName: slot.courseName,
                        duration: slot.duration,
                        end: slot.end,
                        hall: slot.hall,
                        hallUsed: slot.hallUsed,
                        hours: slot.hours,
                        loginTime: slot.loginTime,
                        logoutTime: slot.logoutTime,
                        remarks: slot.remarks,
                        session: slot.session,
                        start: slot.start,
                        status: slot.status,
                    }
                })
            }
        }),
        delete: false
    }

    if (data?.id) {
        formatedData = {
            ...formatedData,
            id: parseInt(decodeUrlID(data.id) || ""),
        }
    }
    return formatedData
}
const validateSlots = (editedTimetable: EdgeTimeTable) => {
    for (const period of editedTimetable.node.period) {
        for (const slot of period.slots) {

            if (!slot.start) {
                alert(`Validation 1 Error: Start time is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.end) {
                alert(`Validation 2 Error: End time is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.courseId || slot.courseId < 1) {
                alert(`Validation 3 Error: Course is missing or invalid in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.assignedToId || slot.assignedToId < 1) {
                alert(`Validation 4 Error: Lecturer is missing or invalid in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.hall) {
                alert(`Validation 5 Error: Hall is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.hours || slot.hours < 1) {
                alert(`Validation 6 Error: Hours must be greater than 0 in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.session) {
                alert(`Validation 7 Error: Session is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (slot.status !== "Pending" && slot.status !== "LoggedIn" && slot.status !== "LoggedOut" && slot.status !== "Completed" && slot.status !== "Suspended") {
                alert(`Validation 8 Error: Status is missing in slot for ${slot.courseName}`);
                return false;
            }
        }
    }
    return true;
};



const CREATE_UPDATE_TIMETABLE = gql`
  mutation CreateTimeTable(
    $id: ID,
    $specialtyId: ID!,
    $published: Boolean!,
    $year: Int!, 
    $month: Int!,
    $period: GenericScalar!,
    $createdById: ID,
    $updatedById: ID,
    $delete: Boolean!
) {
    createUpdateDeleteTimeTable(
      id: $id,
      specialtyId: $specialtyId,
      published: $published,
      year: $year,
      month: $month,
      period: $period,
      createdById: $createdById,
      updatedById: $updatedById,
      delete: $delete
    ) {
      timetable {
        id
      }
    }
  }
`;