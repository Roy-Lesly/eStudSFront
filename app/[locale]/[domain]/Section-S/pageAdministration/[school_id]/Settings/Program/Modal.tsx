import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import MyInputField from '@/MyInputField';


const Modal = ({
    setModalOpen,
  }: {
    setModalOpen: any;
  }) => {
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
      createdById: user.user_id,
      name: '',
      description: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }; 

    const [loading, setLoading] = useState(false);

    const [createMainSubject, { data }] = useMutation(CREATE_DATA)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await createMainSubject({ variables: formData });
        if (result.data.createProgramSec.programSec.id) {
          alert(`Success creating:, ${result.data.createProgramSec.programSec.name}`)
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
          <h2 className="font-semibold mb-4 text-lg">Add Program</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MyInputField
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Program Name"
                  placeholder="Enter Program name"
                  required
                />
            </div>
            <div>
              <MyInputField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  label="Program Description"
                  placeholder="Enter Program Description"
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



  const CREATE_DATA = gql`
    mutation CreateProgramSec($name: String!, $description: String!) {
      createProgramSec(name: $name, description: $description) {
        programSec {
          id
          name
          description
        }
      }
    }
  `;



