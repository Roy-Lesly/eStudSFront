'use client';
import React, { useState } from 'react'
import InputField from '@/componentsTwo/InputField';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { protocol } from '@/config';
import { getDataNotProtected } from '@/functions';
import { GetPreInscriptionInter } from '@/Domain/Utils-H/userControl/userInter';
import { Resolution, Margin, Options } from 'react-to-pdf';
import { OpenGetPreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig';


const SchemaCreate = z.object({
    registration_number: z.string().optional(),
    dob: z.string().optional(),
    telephone: z.coerce.number().optional(),
    full_name: z.string().optional(),
})

type Inputs = z.infer<typeof SchemaCreate>;

const CheckForm = ({ params }: any) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const [clicked, setClicked] = useState<boolean>(false);
    const targetRef = () => document.getElementById("reg_form")
    const [page, setPage] = useState<number>(1);
    const [responseData, setResponseData] = useState<GetPreInscriptionInter>();

    const onSubmit = handleSubmit((formVals) => {
        setClicked(true);
        const ch = (registration_number: any, full_name: any, dob: any, telephone: any) => {
            if (registration_number && full_name) { return { registration_number, full_name } }
            if (registration_number && dob) { return { registration_number, dob } }
            if (registration_number && telephone) { return { registration_number, telephone } }
            if (full_name && dob) { return { full_name, dob } }
            if (full_name && telephone) { return { full_name, telephone } }
            if (dob && telephone) { return { dob, telephone } }
        }
        const newData = {
            registration_number: formVals.registration_number?.toString(),
            full_name: formVals.full_name?.toString(),
            dob: formVals.dob?.toString(),
            telephone: formVals.telephone,
        }
        const n = ch(newData.registration_number, newData.full_name, newData.dob, newData.telephone);
        const call = async () => {
            if (n) {
                const response = await getDataNotProtected(
                    protocol + "api" + params.domain + OpenGetPreInscriptionUrl,
                    { ...n }, params.domain
                )
                if (response && response.count) {
                    setPage(2)
                    setResponseData(response.results[0]);
                }
            }
            setClicked(false)
        }
        call()
    })

    return (
        <>
            {responseData && page == 2 ?
                <div className='flex flex-col gap-2 h-full w-full'>
                    <h1 className='flex font-bold h-[5%] justify-center text-center text-xl w-full'>Click Below To Download Form</h1>
                </div>
                :
                <div className='border md:p-4 p-2'>
                    <h1 className='flex font-bold my-2 text-center text-xl'>Complete The Form Below To Check Status</h1>

                    <form onSubmit={onSubmit} className='flex flex-col gap-4 md:m-4'>
                        <InputField
                            label="Pre-Inscription Number"
                            label_two="Numero"
                            name="registration_number"
                            register={register}
                            error={errors.registration_number}
                        />
                        <InputField
                            label="Name"
                            label_two="Nom"
                            name="full_name"
                            register={register}
                            error={errors.full_name}
                        />
                        <InputField
                            label="Date of Birth"
                            label_two="Date de Naissance"
                            name="dob"
                            register={register}
                            error={errors.dob}
                            type='date'
                        />
                        <InputField
                            label="Telephone"
                            label_two="Telephone"
                            name="telephone"
                            register={register}
                            error={errors.telephone}
                            type='number'
                        />

                        <MyButtonModal type={"Search"} clicked={clicked} />

                    </form>
                </div>
            }
        </>
    )
}

export default CheckForm


const Form = ({ data }: any) => {

    return <div className='border border-red h-full w-full'>
        <span>{data.registration_number}</span>
        <span>{data.full_name}</span>
        <span>{data.telephone}</span>
        <span>{data.sex}</span>
    </div>

}


const options: Options = {
    filename: "Print ",
    // default is `save`
    method: 'save',
    resolution: Resolution.MEDIUM,
    page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.NONE,
        format: 'A4',
        // default is 'portrait'
        orientation: 'portrait',
    },
    canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: 'image/jpeg',
        qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break, 
    // so use with caution.
    overrides: {
        // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
        pdf: {
            compress: true
        },
        // see https://html2canvas.hertzen.com/configuration for more options
        canvas: {
            useCORS: true
        }
    },
};