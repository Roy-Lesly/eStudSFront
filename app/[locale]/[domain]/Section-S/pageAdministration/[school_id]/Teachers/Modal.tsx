import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import MyInputField from '@/MyInputField';
import { ListSecondaryStream } from '@/constants';


const thisYear = new Date().getFullYear()
const Modal = ({
  params,
  setModalOpen,
  secondaryLevels,
}: {
  params: any;
  setModalOpen: any;
  secondaryLevels: { id: string | number, name: string }[]
}) => {
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [formData, setFormData] = useState({
    createdById: user.user_id,
    levelId: "0",
    stream: "",
    option: '',
    academicYear: '',
    registration: '',
    tuition: '',
    paymentOne: '',
    paymentTwo: '',
    paymentThree: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const [createClassroom, { data }] = useMutation(CREATE_DATA)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFormData = {
      ...formData,
      schoolId: parseInt(params.school_id),
      levelId: parseInt(formData.levelId),
      registration: parseInt(formData.registration),
      tuition: parseInt(formData.tuition),
      paymentOne: parseInt(formData.paymentOne),
      paymentTwo: parseInt(formData.paymentTwo),
      paymentThree: parseInt(formData.paymentThree),
    }
    try {
      const result = await createClassroom({ variables: newFormData });
      if (result.data.createClassroom.classroom.id) {
        alert(`Success creating:, ${result.data.createClassroom.classroom.level.level}-${result.data.createClassroom.classroom.academicYear}`)
        window.location.reload()
        setModalOpen(false);
      };
    } catch (err: any) {
      alert(`error creating:, ${err}`)
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
        <h2 className="font-semibold mb-4 text-lg">Add Classroom</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>

            <MyInputField
              id="levelId"
              name="levelId"
              value={formData.levelId}
              onChange={handleChange}
              label="Level ?"
              placeholder="Choose Level"
              required
              type='select'
              options={secondaryLevels}
            />

            <div className='flex flex-row gap-2'>
              <MyInputField
                id="stream"
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                label="Section ?"
                placeholder="Choose Section"
                required
                type='select'
                options={ListSecondaryStream}
              />

              <MyInputField
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                label="Year ?"
                placeholder="Choose Year"
                required
                type='select'
                options={[`${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`]}
              />
            </div>

            <MyInputField
              id="option"
              name="option"
              value={formData.option}
              onChange={handleChange}
              label="Option"
              placeholder="Enter Option"
              required={false}
            />

            <div className='flex flex-row gap-2'>
              <MyInputField
                id="registration"
                name="registration"
                value={formData.registration}
                onChange={handleChange}
                label="registration ?"
                placeholder="Choose registration"
                required
                type='number'
              />

              <MyInputField
                id="tuition"
                name="tuition"
                value={formData.tuition}
                onChange={handleChange}
                label="tuition ?"
                placeholder="Choose tuition"
                required
                type='number'
              />
            </div>

            <MyInputField
              id="paymentOne"
              name="paymentOne"
              value={formData.paymentOne}
              onChange={handleChange}
              label="paymentOne ?"
              placeholder="Choose paymentOne"
              required
              type='number'
            />

            <MyInputField
              id="paymentTwo"
              name="paymentTwo"
              value={formData.paymentTwo}
              onChange={handleChange}
              label="paymentTwo"
              placeholder="Choose paymentTwo"
              required
              type='number'
            />

            <MyInputField
              id="paymentThree"
              name="paymentThree"
              value={formData.paymentThree}
              onChange={handleChange}
              label="paymentThree"
              placeholder="Choose paymentThree"
              required
              type='number'
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



const CREATE_DATA = gql`
    mutation CreateClassroom(
      $schoolId: Int!
      $levelId: Int!
      $stream: String!
      $academicYear: String!
      $option: String
      $registration: Int!
      $tuition: Int!
      $paymentOne: Int!
      $paymentTwo: Int!
      $paymentThree: Int
    ) {
      createClassroom(
        schoolId: $schoolId
        levelId: $levelId
        stream: $stream
        academicYear: $academicYear
        option: $option
        registration: $registration
        tuition: $tuition
        paymentOne: $paymentOne
        paymentTwo: $paymentTwo
        paymentThree: $paymentThree
      ) {
        classroom {
          id
          academicYear
          level { level }
        }
      }
    }
  `;



