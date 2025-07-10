import { useState } from "react";
import { EdgeCourse, EdgeHall, Slot } from "@/Domain/schemas/interfaceGraphql";
import { calculateHours, decodeUrlID, roundToNearest30 } from "@/functions";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { FaPlus } from "react-icons/fa";


interface Props {
    slots: Slot[];
    date: string;
    editMode: boolean;
    onUpdate: (updatedSlots: Slot[]) => void;
    apiCourses: EdgeCourse[],
    apiHalls: EdgeHall[]
}

const TimeSlot = ({ slots, date, editMode, onUpdate, apiCourses, apiHalls }: Props) => {

    const [editedSlots, setEditedSlots] = useState<Slot[]>(slots);

    const addSlot = () => {
        const newSlot: Slot = {
            assignedToId: 0,
            assignedToName: "",
            byId: 0,
            byName: "",
            courseId: 0,
            courseName: "",
            duration: 0,
            end: "",
            hall: "",
            hallUsed: "",
            hours: 0,
            loginTime: "",
            logoutTime: "",
            remarks: "",
            session: "",
            start: "",
            status: "Pending",
        };

        const updatedSlots = [...editedSlots, newSlot];
        setEditedSlots(updatedSlots);
        onUpdate(updatedSlots);
    };

    const removeSlot = (index: number) => {
        const updatedSlots = editedSlots.filter((_, i) => i !== index);
        setEditedSlots(updatedSlots);
        onUpdate(updatedSlots);
    };

    const handleInputChange = (index: number, field: keyof Slot, value: any) => {
        const updatedSlots = [...editedSlots];
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
        setEditedSlots(updatedSlots);
        onUpdate(updatedSlots);
    };

    const handleInputChangeTime = (index: number, field: keyof Slot, value: string) => {
        if (value) {
            const updatedSlots = [...editedSlots];

            const roundedValue = roundToNearest30(value);
            updatedSlots[index] = { ...updatedSlots[index], [field]: roundedValue };

            const { start, end } = updatedSlots[index];
            if (start && end) {
                updatedSlots[index].hours = calculateHours(start, end);
            }

            setEditedSlots(updatedSlots);
            onUpdate(updatedSlots);
        }
    };

    const handleInputChangeCourse = (index: number, field: keyof Slot, value: any) => {
        const updatedSlots = [...editedSlots];
        const course = apiCourses.filter((item: EdgeCourse) => item.node.mainCourse.courseName === value)[0]

        updatedSlots[index] = {
            ...updatedSlots[index],
            courseName: value,
            courseId: parseInt(decodeUrlID(course.node.id)),
            assignedToId: parseInt(decodeUrlID(course.node.assignedTo.id)),
            assignedToName: course.node.assignedTo.fullName
        };
        setEditedSlots(updatedSlots);
        onUpdate(updatedSlots);
    };

    return (
        <div className="mt-2 border rounded-lg overflow-hidden shadow-md">

            {editMode ? <div className="flex justify-end gap-6 items-center">
                <h1>{date}</h1>
                <div onClick={addSlot} className="p-1 flex gap-2 items-center rounded hover:bg-green-300">
                    <button
                        className="flex gap-2 items-center rounded-full bg-green-500 p-2 hover:bg-green-600"
                    >
                        <FaPlus color="white" size={22} />
                    </button>
                    Add Slot
                </div>
            </div> : null}

            <table className="w-full border-collapse">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-2">Time</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">Course</th>
                        <th className="p-2">Lecturer</th>
                        <th className="p-2">Session</th>
                        <th className="p-2">Hall</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {editedSlots?.map((slot: Slot, index: any) => (
                        <tr key={index} className="border-b text-center">
                            <td className="p-2">
                                {editMode ? (
                                    <>
                                        <TimePicker
                                            onChange={(value: any) => handleInputChangeTime(index, "start", value)}
                                            value={slot.start}
                                            format="HH:mm" // Ensures 24-hour format
                                            disableClock={true}
                                        />
                                        -
                                        <TimePicker
                                            onChange={(value: any) => handleInputChangeTime(index, "end", value)}
                                            value={slot.end}
                                            format="HH:mm" // Ensures 24-hour format
                                            disableClock={true}
                                        />
                                    </>
                                ) : (
                                    `${slot.start} - ${slot.end}`
                                )}
                            </td>
                            <td className="p-2 font-medium">{slot.hours}H</td>
                            <td className="p-2 text-start">
                                {editMode && apiCourses ? (
                                    <select
                                        value={slot.courseName}
                                        onChange={(e: any) => handleInputChangeCourse(index, "courseName", e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option key="x" value="">------</option>
                                        {apiCourses.map((course: EdgeCourse) => <option key={course.node.id} value={course.node.mainCourse.courseName}>{course.node.mainCourse.courseName}</option>)}
                                    </select>
                                ) : (
                                    slot.courseName
                                )}
                            </td>
                            <td className="p-2 text-start">{slot.assignedToName}</td>
                            <td className="p-2">
                                {editMode ?
                                    <select
                                        defaultValue={slot.session}
                                        onChange={(e: any) => handleInputChange(index, "session", e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option key="" value="Morning">--------</option>
                                        <option key="Morning" value="Morning">Morning</option>
                                        <option key="Evening" value="Evening">Evening</option>
                                    </select>
                                    : (
                                        slot.session
                                    )}
                            </td>
                            <td className="p-2">
                                {editMode && apiHalls ? (
                                    <select
                                        value={slot.hall}
                                        onChange={(e: any) => handleInputChange(index, "hall", e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option key="x" value="">------</option>
                                        {apiHalls.map((hall: EdgeHall) => <option key={hall.node.id} value={hall.node.name}>{hall.node.name}</option>)}
                                    </select>
                                ) : (
                                    slot.hall
                                )}
                            </td>
                            <td className="p-2">
                                {!["LoggedIn", "Completed", "LoggedOut"].includes(slot.status) && (
                                    <button
                                        onClick={() => removeSlot(index)}
                                        className="bg-red text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                )}
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimeSlot;
