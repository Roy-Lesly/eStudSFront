import React from 'react'


const MyButtonModal = (
    { type, clicked, title, icon, className }:
    {  clicked: boolean, type?: string, className?: string, title?: string, icon?: any }
) => {

    return <>
        {clicked ?
        <button className={`p-2 rounded-md text-white flex items-center justify-center`}>
            <span className={`${type == "create" ? "border-green-500" : type == "update" ? "border-bluedash" : "border-redlight"} animate-spin border-6  border-t-transparent flex h-[34px] rounded-full w-[34px]`}>.</span>
        </button>

            :
            <button className={`${type == "create" ? "bg-green-600" : type == "update" ? "bg-blue-400" : "bg-blue-700"} ${className} font-medium px-6 py-2 flex items-center gap-2 rounded-md text-white justify-center`}>
                {title ? title : type === "create" ? "Create" : type === "update" ? "Update" : type === "delete" ? "Delete" : type} 
                {icon}
            </button>
        }
    </>


}

export default MyButtonModal