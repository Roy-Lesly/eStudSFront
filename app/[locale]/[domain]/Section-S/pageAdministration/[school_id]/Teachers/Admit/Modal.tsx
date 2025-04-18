import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import MyInputField from '@/MyInputField';


const Modal = ({
    setModalOpen,
    params
  }: {
    setModalOpen: any;
    params: any
  }) => {
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
      createdById: user.user_id,
      firstName: '',
      lastName: '',
      sex: '',
      dob: '',
      pob: '',
      telephone: '',
      email: '',
      address: '',
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
      try {
        const result = await createMainSubject({ variables: {
            ...formData,
            schoolId: params.school_id
          }
        });
        if (result.data.createMainSubject.mainSubject.id) {
          alert(`Success creating Subject:, ${result.data.createMainSubject.mainSubject.subjectName}`)
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
        className="bg-black bg-opacity-70 fixed flex inset-0 items-center justify-center md:ml-40 w-full z-50"
      >
        <div className="bg-white lg:w-[600px] md:w-[400px] p-6 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4 text-lg">Add User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex flex-col gap-2 md:flex-row">
              <MyInputField
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  label="First Name"
                  placeholder="Enter First name"
                  required
                />
              <MyInputField
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  label="last Name"
                  placeholder="Enter last name"
                  required
                />
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <MyInputField
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  label="Date of Birth"
                  placeholder="Enter Date of Birth"
                  required
                  type='date'
                />
              <MyInputField
                  id="pob"
                  name="pob"
                  value={formData.pob}
                  onChange={handleChange}
                  label="Place of Birth"
                  placeholder="Enter Place of Birth"
                  required
                />
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <MyInputField
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  label="Address"
                  placeholder="Enter Address"
                  required
                />
              <MyInputField
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  placeholder="Enter Email"
                  required
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
    mutation CreateCustomUser(
      $firstName: String!
      $lastName: String!
      $dob: String!
      $pob: String!
      $address: String!
      $email: String!
      $telephone: String!
    ) {
      createCustomUser(
        firstName: $firstName
        lastName: $lastName
        dob: $dob
        pob: $pob
        address: $address
        email: $email
        telephone: $telephone
      ) {
        customUser {
          id
          fullName
        }
      }
    }
  `;



