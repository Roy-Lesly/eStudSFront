'use client';
import { NodeSubjectSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeftLong } from 'react-icons/fa6';

const subjectTypeChoices = [
  { label: 'Theory', value: 'THEORY' },
  { label: 'Practical', value: 'PRACTICAL' },
];

type SubjectField = keyof Pick<
  NodeSubjectSec,
  'subjectType' | 'subjectCoefficient' | 'compulsory'
>;


const EditableSubjectTable = ({ data, sp, p }: { data: any[], sp: any, p: any }) => {

  const { t } = useTranslation("common");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null

  const [subjects, setSubjects] = useState(() =>
    data.map(item => ({
      mainSubjectId: item.node.id,
      subjectName: item.node.subjectName,
      subjectCode: '',
      subjectType: 'THEORY',
      subjectCoefficient: 1,
      compulsory: false,
    }))
  );

  const handleChange = (index: number, field: SubjectField, value: any) => {
    setSubjects(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeSubject = (msid: string) => {
    const ids = JSON.parse(sp?.ids)
    const submittedId = decodeUrlID(msid)
    setSubjects(prev => prev.filter(s => s.mainSubjectId !== msid));
    router.push(`/${p.locale}/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageSubjects/fill/?classId=${sp?.classId}&ids=${JSON.stringify(ids.filter((i: string) => i != submittedId))}`)
  };

  const handleSubmit = async () => {

    const isValid = subjects.every(sub =>
      sub.subjectCode?.trim() &&
      sub.subjectType &&
      Number(sub.subjectCoefficient) > 0
    );

    if (!isValid) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    let count = 0

    for (const sub of subjects) {
      const payload = {
        ...sub,
        mainsubjectId: parseInt(decodeUrlID(sub.mainSubjectId)),
        classroomsecId: parseInt(decodeUrlID(sp?.classId)),
        subjectCoefficient: Number(sub.subjectCoefficient),
        compulsory: Boolean(sub.compulsory),
        createdById: user?.user_id,
        updatedById: user?.user_id,
        delete: false,
      };

      try {
        const res = await ApiFactory({
          newData: payload,
          editData: payload,
          mutationName: "createUpdateDeleteSubjectSec",
          modelName: "subjectsec",
          successField: "id",
          query,
          router: null,
          params: p,
          redirect: false,
          reload: false,
          returnResponseField: true,
          redirectPath: ``,
          actionLabel: "processing",
        });

        console.log(res);

        if (res?.length > 5) {
          count += 1;
          removeSubject(payload.mainSubjectId)
        }
      } catch (error) {
        errorLog(error);
      }
      console.log(count);
    }
    if (count) {
      alert(t("Subject submissions completed"));
    }


  };


  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="font-bold text-lg text-center">{t("Setup Subjects")}</h2>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">{t("Subject Name")}</th>
            <th className="border p-2">{t("Type")}</th>
            <th className="border p-2">{t("Coefficient")}</th>
            <th className="border p-2">{t("Compulsory")}</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj, idx) => (
            <tr key={subj.mainSubjectId} className="border-b">
              <td className="border p-2">{subj.subjectName}</td>
              <td className="border p-2">
                <select
                  value={subj.subjectType}
                  onChange={(e) => handleChange(idx, 'subjectType', e.target.value)}
                  className="w-full border p-1 rounded"
                >
                  {subjectTypeChoices.map(choice => (
                    <option key={choice.value} value={choice.value}>{choice.label}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  min={1}
                  value={subj.subjectCoefficient}
                  onChange={(e) => handleChange(idx, 'subjectCoefficient', parseInt(e.target.value))}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={subj.compulsory}
                  onChange={(e) => handleChange(idx, 'compulsory', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between gap-3">
        <button
          onClick={() => router.push(`/${p.locale}/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageAcademics/pageSubjects/assign/?classId=${sp?.classId})}`)}
          className="flex gap-2 bg-red hover:bg-slate-500 text-white px-4 py-2 rounded"
        >
          <FaArrowLeftLong size={25} color='white' /> {t("Reset")}
        </button>
        <button
          onClick={() => handleSubmit()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {t("Submit Subjects")}
        </button>
        
      </div>
    </div>
  );
};

export default EditableSubjectTable;



export const query = gql`
    mutation CreateUpdateDeleteSubjectSec(
        $id: ID,
        $mainsubjectId: ID!,
        $classroomsecId: ID!,
        $subjectType: String!,
        $subjectCoefficient: Int!,
        $compulsory: Boolean!,
        $createdById: ID,
        $updatedById: ID!,
        $delete: Boolean!
    ) {
        createUpdateDeleteSubjectSec (
            id: $id,
            mainsubjectId: $mainsubjectId,
            classroomsecId: $classroomsecId,
            subjectType: $subjectType,
            subjectCoefficient: $subjectCoefficient,
            compulsory: $compulsory,
            createdById: $createdById,
            updatedById: $updatedById,
            delete: $delete
        ) {
            subjectsec {
              id
            }
        }
    }
`;


