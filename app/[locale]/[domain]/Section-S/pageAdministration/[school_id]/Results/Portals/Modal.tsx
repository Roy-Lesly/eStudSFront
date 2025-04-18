'use client';

import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { NodePublishSecondary } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { parseJson } from './List';



const Modal = ({ dataUpdate, setOpenModal, params, type }: { dataUpdate: NodePublishSecondary; setOpenModal: Function, params: any, type: "portal" | "publish" }) => {
  const [updatedSeq, setUpdatedSeq] = useState<Record<string, boolean>>({});
  const [updateData] = useMutation(UPDATE_DATA);

  useEffect(() => {
    if (type === "portal" && dataUpdate?.portalSeq) {
      setUpdatedSeq(parseJson(dataUpdate.portalSeq));
    }
    if (type === "publish" && dataUpdate?.publishSeq) {
      setUpdatedSeq(parseJson(dataUpdate.publishSeq));
    }
  }, [dataUpdate]);


  const handleToggle = (seqKey: string) => {
    setUpdatedSeq((prevSeq) => ({
      ...prevSeq,
      [seqKey]: !prevSeq[seqKey], // Toggle the sequence value
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedDataSeq = JSON.stringify(updatedSeq); // Convert the updated sequence object to a string
      let da = {}
      if (type === "portal"){ da = {...dataUpdate, portalSeq: updatedDataSeq, id: parseInt(decodeUrlID(dataUpdate.id)) } }
      if (type === "publish"){ da = {...dataUpdate, publishSeq: updatedDataSeq, id: parseInt(decodeUrlID(dataUpdate.id)) } }

      console.log(da)

      try {
        const result = await updateData({ variables: da });
        if (result.data.updatePublishSecondary.publishSecondary.id) {
          alert(`Success updating:, ${result.data.updatePublishSecondary.publishSecondary.publishTerm}`)
          window.location.reload()
          setOpenModal(false);
        };
      } catch (err: any) {
        alert(`error updating Subject:, ${err}`)
      }
    } catch (error) {
      alert('Error updating data');
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-100 fixed flex inset-0 items-center justify-center ml-20 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="font-semibold mb-4 text-xl">Update {capitalizeFirstLetter(type)} Sequence</h2>

        <div className="space-y-4">
                      {Object.keys(updatedSeq).map((seqKey) => (

            <div key={seqKey} className="flex items-center justify-between">
              <span>{`Sequence ${seqKey.split('_')[1]}`}</span>
              <button
                onClick={() => handleToggle(seqKey)}
                className={`px-4 py-2 rounded-full ${
                  updatedSeq[seqKey] ? 'bg-green-500 text-white' : 'bg-red text-white'
                }`}
              >
                {updatedSeq[seqKey] ? <FaCheck /> : <FaTimes />}
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setOpenModal(false)} className="bg-gray mr-2 px-4 py-2 rounded text-black">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 px-4 py-2 rounded text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;



const UPDATE_DATA = gql`
  mutation UpdatePublishSecondary(
    $id: ID!
    $publishSeq: JSONString
    $portalSeq: JSONString
  ) {
    updatePublishSecondary(
      id: $id 
      publishSeq: $publishSeq 
      portalSeq: $portalSeq 
    ) {
      publishSecondary {
        id
        publishTerm
        publishSeq
        portalSeq
      }
    }
  }
  `;