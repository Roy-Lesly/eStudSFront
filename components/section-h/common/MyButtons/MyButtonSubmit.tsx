import React from 'react'
import { FiDelete, FiSave } from 'react-icons/fi'
import { GrUpdate } from 'react-icons/gr'


export const MyButtonSubmitCreate = () => {
  return (
    <button type="submit" className="bg-greendark dark:focus:ring-primary-800 dark:hover:bg-primary-700 flex focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium gap-2 hover:bg-greenlight items-center justify-center md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-40">
      <span>Save</span><FiSave />
    </button>
  )
}

export const MyButtonSubmitEdit = () => {
  return (
    <button type="submit" className="bg-primary dark:focus:ring-primary-800 dark:hover:bg-primary-700 flex focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-red items-center justify-center md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-40">
      <span>Update</span><GrUpdate />
    </button>
  )
}

export const MyButtonSubmitDelete = () => {
  return (
    <button type="submit" className="bg-primary dark:focus:ring-primary-800 dark:hover:bg-primary-700 flex focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-red items-center justify-center md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-40">
      <span>Delete</span><FiDelete />
    </button>
  )
}

