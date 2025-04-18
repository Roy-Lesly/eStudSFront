import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import MyInputField from '@/MyInputField';


const Modal = ({
  setModalOpen,
  mainSubjects,
  classrooms,
}: {
  setModalOpen: any;
  mainSubjects: {id: string | number, name: string}[]
  classrooms: {id: string | number, name: string}[]
}) => {
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [formData, setFormData] = useState({
    mainSubjectId: "0",
    classroomId: '0',
    createdById: user.user_id,
    subjectCode: '',
    subjectType: 'THEORY',
    compulsory: "false",
    subjectCoefficient: '',
    assigned: false,
    dateAssigned: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const [createMainSubject, { data }] = useMutation(CREATE_MAIN_SUBJECT)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFormData = {
      ...formData,
      mainSubjectId: parseInt(formData.mainSubjectId),
      classroomId: parseInt(formData.classroomId),
      subjectCoefficient: parseInt(formData.subjectCoefficient),
      compulsory: formData.compulsory === "true",
    }
    try {
      const result = await createMainSubject({ variables: newFormData });
      if (result.data.createSubject.subject.id) {
        alert(`Success creating:, ${result.data.createSubject.subject.mainSubject.subjectName}`)
        window.location.reload()
        setModalOpen(false);
      };
    } catch (err: any) {
      alert(`error creating Subject:, ${err}`)
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-black bg-opacity-70 fixed flex inset-0 items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="font-semibold mb-4 text-lg">Add Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>

          <MyInputField
              id="mainSubjectId"
              name="mainSubjectId"
              value={formData.mainSubjectId}
              onChange={handleChange}
              label="MainSubject ?"
              placeholder="Choose Main Subject"
              required
              type='select'
              options={mainSubjects}
            />

          <MyInputField
              id="classroomId"
              name="classroomId"
              value={formData.classroomId}
              onChange={handleChange}
              label="Classroom ?"
              placeholder="Choose CLassroom"
              required
              type='select'
              options={classrooms}
            />

            <MyInputField
              id="subjectCode"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleChange}
              label="Subject Code"
              placeholder="Enter Subject Code"
              required
            />

            <MyInputField
              id="coefficient"
              name="subjectCoefficient"
              value={formData.subjectCoefficient}
              onChange={handleChange}
              label="Subject coefficient"
              placeholder="Enter Subject coefficient"
              required
              type='number'
            />

            <MyInputField
              id="subjectType"
              name="subjectType"
              value={formData.subjectType}
              onChange={handleChange}
              label="Subject Type"
              placeholder="Enter Subject Type"
              required
              type='select'
              options={["THEORY", "PRACTICAL"]}

            />

            <MyInputField
              id="compulsory"
              name="compulsory"
              value={formData.compulsory}
              onChange={handleChange}
              label="Compulsory ?"
              placeholder="Choose Compulsory"
              required
              type='select'
              options={["true", "false"]}
            />

          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};


export default Modal;



const CREATE_MAIN_SUBJECT = gql`
    mutation CreateSubject(
      $mainSubjectId: Int!
      $classroomId: Int!
      $subjectCode: String!
      $subjectType: String!
      $assigned: Boolean!
      $compulsory: Boolean!
      $subjectCoefficient: Int!
      $dateAssigned: String!
    ) {
      createSubject(
        mainSubjectId: $mainSubjectId
        classroomId: $classroomId
        subjectCode: $subjectCode
        subjectType: $subjectType
        assigned: $assigned
        compulsory: $compulsory
        subjectCoefficient: $subjectCoefficient
        dateAssigned: $dateAssigned
      ) {
        subject {
          id
          subjectCode
          mainSubject { subjectName }
        }
      }
    }
  `;



