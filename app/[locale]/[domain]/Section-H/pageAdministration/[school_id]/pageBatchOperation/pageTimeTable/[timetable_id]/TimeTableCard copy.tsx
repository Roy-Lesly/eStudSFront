import { useState } from "react";
import { EdgeCourse, EdgeHall, EdgeTimeTable, Period, Slot } from "@/Domain/schemas/interfaceGraphql";
import { formatDate } from "@/functions";
import TimeSlot from "./TimeSlot";
import { FaPlus } from "react-icons/fa";
import { monthMap } from "@/constants";

// Helper function to get the start of the week (Monday)
const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
    return new Date(date.setDate(diff));
};

// Helper function to get the end of the week (Sunday)
const getEndOfWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
};

// Function to group periods into weeks
const groupPeriodsByWeek = (periods: Period[]) => {
    const weeks: Array<Period[]> = [];
    let currentWeek: Period[] = [];
    let currentWeekStart: Date | null = null;

    periods.forEach((period) => {
        const periodDate = new Date(period.date);

        // Determine the start and end of the week for this period
        const weekStart = getStartOfWeek(new Date(period.date));
        const weekEnd = getEndOfWeek(new Date(period.date));

        // If it's the first period in a new week
        if (!currentWeekStart || periodDate < currentWeekStart || periodDate > weekEnd) {
            if (currentWeek.length > 0) {
                weeks.push(currentWeek); // Add the current week
            }
            currentWeek = [period]; // Start a new week
            currentWeekStart = weekStart;
        } else {
            currentWeek.push(period); // Add to the current week
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek); // Add the last week
    }

    return weeks;
};

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

    const handleSlotUpdate = (updatedPeriod: Period, date: string) => {
        setEditedTimetable((prev: any) => ({
            ...prev,
            node: {
                ...prev.node,
                period: prev.node.period.map((p: Period) => p.date === date ? updatedPeriod : p),
            },
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        if (editMode) {
            console.log(editedTimetable);
            if (!validateSlots(editedTimetable)) {
                setLoading(false);
                return;
            }
            setEditMode(false);
            setLoading(false);
        } else {
            setEditMode(true);
            setLoading(false);
        }
    };

    // Group periods by week
    const groupedPeriods = groupPeriodsByWeek(editedTimetable.node.period);

    return (
        <div className="border rounded-lg shadow-lg p-2 bg-white text-black">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    📅 {editedTimetable.node.year} - Month: {editedTimetable.node?.monthName}
                </h2>
                <div onClick={addPeriod} className="p-1 flex gap-2 items-center rounded hover:bg-green-300">
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

            {/* Render grouped weeks */}
            {groupedPeriods.map((week, weekIndex) => (
                <div key={weekIndex} className="mt-5">
                    <h3 className="text-xl font-semibold mb-2">Week {weekIndex + 1}</h3>

                    {week.map((day: any, index: any) => (
                        <div key={index} className="mt-3">
                            <button
                                onClick={() => setExpanded(expanded === day.date ? null : day.date)}
                                className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition duration-200"
                            >
                                <span className="font-semibold text-lg">📆 {formatDate(day.date)}</span>
                            </button>

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
            ))}
        </div>
    );
};

export default TimeTableCard;


const validateSlots = (editedTimetable: EdgeTimeTable) => {
    for (const period of editedTimetable.node.period) {
        for (const slot of period.slots) {
            console.log(editedTimetable.node.period)

            if (!slot.start) {
                alert(`Validation Error: Start time is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.end) {
                alert(`Validation Error: End time is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.courseId || slot.courseId < 1) {
                alert(`Validation Error: Course is missing or invalid in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.assignedToId || slot.assignedToId < 1) {
                alert(`Validation Error: Lecturer is missing or invalid in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.hall) {
                alert(`Validation Error: Hall is missing in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.hours || slot.hours < 1) {
                alert(`Validation Error: Hours must be greater than 0 in slot for ${slot.courseName}`);
                return false;
            }
            if (!slot.session) {
                alert(`Validation Error: Session is missing in slot for ${slot.courseName}`);
                return false;
            }
        }
    }
    return true;
};