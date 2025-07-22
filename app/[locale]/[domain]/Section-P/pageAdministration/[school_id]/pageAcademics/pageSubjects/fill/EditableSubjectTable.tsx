'use client';
import { NodeSubjectPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { decodeUrlID } from '@/utils/functions';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const subjectTypeChoices = [
  { label: 'Theory', value: 'THEORY' },
  { label: 'Practical', value: 'PRACTICAL' },
];

type SubjectField = keyof Pick<
  NodeSubjectPrim,
  'subjectCode' | 'subjectType' | 'subjectCoefficient'
>;


const EditableSubjectTable = ({ data, sp, p }: { data: any[], sp: any, p: any }) => {

  const { t } = useTranslation("common");
  const [count, setCount] = useState(0)
  const [subjects, setSubjects] = useState(() =>
    data.map(item => ({
      mainSubjectprimId: item.node.id,
      subjectName: item.node.subjectName,
      subjectCode: '',
      subjectType: 'THEORY',
      subjectCoefficient: 1,
    }))
  );

  const handleChange = (index: number, field: SubjectField, value: any) => {
    setSubjects(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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

    for (const sub of subjects) {
      const payload = {
        ...sub,
        mainsubjectprimId: parseInt(decodeUrlID(sub.mainSubjectprimId)),
        classroomprimId: parseInt(decodeUrlID(sp?.classId)),
        subjectCoefficient: Number(sub.subjectCoefficient),
        delete: false,
      };

      try {
        const res = await ApiFactory({
          newData: payload,
          editData: payload,
          mutationName: "createUpdateDeleteSubjectPrim",
          modelName: "subjectprim",
          successField: "id",
          query,
          router: null,
          params: p,
          redirect: false,
          reload: false,
          returnResponseField: false,
          redirectPath: ``,
          actionLabel: "processing",
        });

        if (res?.id.length > 5) {
          setCount(count + 1);
        }
      } catch (error) {
        errorLog(error);
      }

      if (count) {
        alert(t("Subject submissions completed"));
      }
    }

  };


  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="font-bold text-lg text-center">{t("Setup Subjects")}</h2>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">{t("Subject Name")}</th>
            <th className="border p-2">{t("Subject Code")}</th>
            <th className="border p-2">{t("Type")}</th>
            <th className="border p-2">{t("Coefficient")}</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj, idx) => (
            <tr key={subj.mainSubjectprimId} className="border-b">
              <td className="border p-2">{subj.subjectName}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={subj.subjectCode}
                  onChange={(e) => handleChange(idx, 'subjectCode', e.target.value.toUpperCase())}
                  className="w-full border p-1 rounded"
                  placeholder="e.g. MTH101"
                />
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleSubmit()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Submit Subjects
        </button>
        <button
          onClick={() => setSubjects([])}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default EditableSubjectTable;



export const query = gql`
    mutation CreateUpdateDeleteSubjectPrim(
        $id: ID,
        $mainsubjectprimId: ID!,
        $classroomprimId: ID!,
        $subjectCode: String!,
        $subjectType: String!,
        $subjectCoefficient: Int!,
        $delete: Boolean!
    ) {
        createUpdateDeleteSubjectPrim(
            id: $id,
            mainsubjectprimId: $mainsubjectprimId,
            classroomprimId: $classroomprimId,
            subjectCode: $subjectCode,
            subjectType: $subjectType,
            subjectCoefficient: $subjectCoefficient,
            delete: $delete
        ) {
            subjectprim {
                id
            }
        }
    }
`;


