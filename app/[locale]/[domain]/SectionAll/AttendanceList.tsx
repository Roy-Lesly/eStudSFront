import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MyTableComp from "@/components/Table/MyTableComp";
import { FaCheck, FaTimes } from "react-icons/fa";
import { decodeUrlID } from "@/utils/functions";
import { LoaderIcon } from "react-hot-toast";
import { SaveAll } from "lucide-react";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { gql } from "@apollo/client";
import { JwtPayload } from "@/utils/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";

type AttendanceStatus = "present" | "absent" | null;

type StudentNode = {
    id: string;
    customuser: {
        fullName: string;
        matricle: string;
        sex: string;
    };
    specialty?: { academicYear?: string; };
    classroomsec?: { academicYear?: string; };
    classroomprim?: { academicYear?: string; };
};

interface AttendanceListProps {
    section: "H" | "S" | "P";
    data: { node: StudentNode }[];
    p: any;
    sp: any;
    classroomId: number;
    instance?: any;
}


const AttendanceList: React.FC<AttendanceListProps> = ({ data, section, classroomId, p, instance }) => {
    const today = new Date().toISOString().slice(0, 10);

    const { t } = useTranslation("common");
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [changed, setChanged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [existing, setSetExisting] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(true);

    useEffect(() => {
        if (instance?.infoData && !existing) {
            const p = JSON.parse(instance.infoData)
            if (p[today]) {
                setAttendance(p[today]);
                setSetExisting(true)
            }
            const diff = new Date().getTime() - new Date(instance?.updatedAt).getTime();
            if ((diff / 1000) > 240) {
                setCanEdit(false)
            }
            console.log(p);
        }
    }, [instance])

    const toggleAttendance = (studentId: string, status: AttendanceStatus) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: prev[studentId] === status ? null : status,
        }));
        setChanged(true)
    };

    const handleBulkMark = (status: AttendanceStatus) => {
        const newAttendance: Record<string, AttendanceStatus> = {};
        data.forEach((item) => {
            newAttendance["stu_" + decodeUrlID(item.node.id)] = status;
        });
        setAttendance(newAttendance);
        setChanged(true)
    };

    const Columns: any = [
        { header: "#", align: "center", render: (_item: StudentNode, index: number) => index + 1 },
        { header: t("Matricle"), accessor: "node.customuser.matricle", align: "left" },
        { header: t("Full Name"), accessor: "node.customuser.fullName", align: "left" },
        { header: t("Gender"), accessor: "node.customuser.sex", align: "center" },
        {
            header: t("Present"),
            align: "center",
            render: (item: { node: StudentNode }) => {
                const studentId = item.node.id;
                const isActive = attendance["stu_" + decodeUrlID(studentId)] === "present";
                return (
                    <button
                        onClick={() => toggleAttendance("stu_" + decodeUrlID(studentId), "present")}
                        className={`px-4 py-1 rounded-lg font-bold transition-colors ${isActive ? "bg-green-600 text-white" : "bg-green-100 text-slate-300"
                            }`}
                    >
                        <FaCheck />
                    </button>
                );
            },
        },
        {
            header: t("Absent"),
            align: "center",
            render: (item: { node: StudentNode }) => {
                const studentId = item.node.id;
                const isActive = attendance["stu_" + decodeUrlID(studentId)] === "absent";
                return (
                    <button
                        onClick={() => toggleAttendance("stu_" + decodeUrlID(studentId), "absent")}
                        className={`px-4 py-1 rounded-lg font-bold transition-colors ${isActive ? "bg-red text-white" : "bg-orange-100 text-slate-300"
                            }`}
                    >
                        <FaTimes />
                    </button>
                );
            },
        },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        const today = new Date()
        const month = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0")
        const date = `${month.replace("_", "-")}-${String(today.getDate()).padStart(2, "0")}`;
        let infoData: any = JSON.stringify({ [date]: attendance });

        const token = localStorage.getItem("token");
        const user: JwtPayload | null = token ? jwtDecode(token) : null

        if (!user) {
            alert(`${t("Not Logged In")}`);
            return;
        }
        let dataToSubmit: any = {
            month,
            classroomId,
            infoData,
            updatedById: user.user_id,
            delete: false,
        }
        if (instance?.id) {
            dataToSubmit = {
                ...dataToSubmit,
                createdById: user.user_id,
            }
        }

        await ApiFactory({
            newData: dataToSubmit,
            editData: dataToSubmit,
            mutationName: section === "S" ? "createUpdateDeleteAttendanceGeneralSecondary" : section === "P" ? "createUpdateDeleteAttendanceGeneralPrimary" : "createUpdateDeleteAttendanceGeneral",
            modelName: section === "S" ? "attendancegeneralsecondary" : section === "P" ? "attendancegeneralprimary" : "attendancegeneral",
            successField: "id",
            query: section === "S" ? querySec : section === "P" ? queryPrim : query,
            router: null,
            params: p,
            redirect: false,
            reload: true,
            returnResponseField: false,
            redirectPath: ``,
            actionLabel: "processing",
        });

    };

    return (
        <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                {existing ? <div className="flex gap-2">
                    <span className="bg-blue-100 text-black px-4 py-2 rounded hover:bg-green-300 font-medium">
                        {t("Conducted By")} {instance?.updatedBy?.fullName}
                    </span>
                    <span className="bg-blue-100 text-black px-4 py-2 rounded hover:bg-green-300 font-medium">
                        {t("At")} {instance?.updatedAt.slice(0, 10)} - {instance?.updatedAt.slice(11, 16)}
                    </span>
                </div> : <></>}

                <div className="flex gap-2">
                    <button
                        onClick={() => handleBulkMark("present")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium"
                    >
                        {t("Mark All Present")}
                    </button>
                    <button
                        onClick={() => handleBulkMark("absent")}
                        className="bg-red text-white px-4 py-2 rounded hover:bg-orange-600 font-medium"
                    >
                        {t("Mark All Absent")}
                    </button>
                </div>
            </div>

            {data.length > 0 ?
                <MyTableComp
                    data={data.sort((a, b) =>
                        a.node.customuser.fullName.toLowerCase().localeCompare(b.node.customuser.fullName.toLowerCase())
                    )}
                    columns={Columns}
                />
                :
                <div className="text-center py-4 text-gray-500">{t("No Students Found")}</div>
            }

            {
                loading ?
                    <LoaderIcon />
                    :
                    changed && canEdit ?
                        <div className="flex items-center justify-center w-full">
                            <button
                                className="flex shadow-lg rounded-lg px-4 py-2 bg-green-600 text-white font-bold text-lg my-4 gap-2"
                                onClick={() => handleSubmit()}
                            >
                                {t("Submit")} <SaveAll size={30} />
                            </button>
                        </div>
                        :
                        null
            }
        </div>
    );
};

export default AttendanceList;



export const query = gql`
  mutation CreateUpdateDelete(
    $classroomId: ID!
    $month: String!
    $infoData: JSONString!
    $updatedById: ID!
    $createdById: ID
    $delete: Boolean!
  ) {
    createUpdateDeleteAttendanceGeneral(
      classroomId: $classroomId
      month: $month
      infoData: $infoData
      updatedById: $updatedById
      createdById: $createdById
      delete: $delete
    ) {
      attendancegeneral {
        id
      }
    }
  }
`;

export const querySec = gql`
  mutation CreateUpdateDelete(
    $classroomId: ID!
    $month: String!
    $infoData: JSONString!
    $updatedById: ID!
    $createdById: ID
    $delete: Boolean!
  ) {
    createUpdateDeleteAttendanceGeneralSecondary(
      classroomId: $classroomId
      month: $month
      infoData: $infoData
      updatedById: $updatedById
      createdById: $createdById
      delete: $delete
    ) {
      attendancegeneralsecondary {
        id
      }
    }
  }
`;

export const queryPrim = gql`
  mutation CreateUpdateDelete(
    $classroomId: ID!
    $month: String!
    $infoData: JSONString!
    $updatedById: ID!
    $createdById: ID
    $delete: Boolean!
  ) {
    createUpdateDeleteAttendanceGeneralPrimary(
      classroomId: $classroomId
      month: $month
      infoData: $infoData
      updatedById: $updatedById
      createdById: $createdById
      delete: $delete
    ) {
      attendancegeneralprimary {
        id
      }
    }
  }
`;
