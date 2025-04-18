'use client'
import React, { FC } from 'react'
// import toast from 'react-hot-toast'
import Swal from 'sweetalert2'


interface Props {
    errorMessage: any
}
const NotificationError:FC<Props> = ({ errorMessage }) => {

    if (errorMessage.success) {

        const alert = () => {
            Swal.fire({
              title: `Created Successfully`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
          }
          alert()
        return;
    }
    if (errorMessage.customsuccess) {

        const alert = () => {
            Swal.fire({
              title: `${errorMessage.customsuccess.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
          }
          alert()
        return;
    }
    if (errorMessage.created) {
        const alert = () => {
            Swal.fire({
            //   title: `${errorMessage.created.toString()}`,
              title: `Created Successfully`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
        }
        alert()        
        return;    }
    if (errorMessage.updated) {
        const alert = () => {
            Swal.fire({
            //   title: `${errorMessage.updated.toString()}`,
              title: `Updated Successfully`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.deleted) {
        const alert = () => {
            Swal.fire({
            //   title: `${errorMessage.deleted.toString()}`,
            title: `Deleted Successfully`,
            timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "warning",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.error) {
        const alert = () => {
            Swal.fire({
            title: `Error Occured`,
            timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "error",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.customerror) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.customerror.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "error",
            })
        }
        alert()        
        return;
    }
    if (errorMessage.customsuccess) {
        const alert = () => {
            Swal.fire({
              title: `${errorMessage.customsuccess.toString()}`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: "top-end",
              icon: "success",
            })
        }
        alert()        
        return;
    }
    
    return (
        <></>
    )
}

export default NotificationError