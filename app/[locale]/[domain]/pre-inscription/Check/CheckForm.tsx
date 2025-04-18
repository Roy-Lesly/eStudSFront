'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from '@/componentsTwo/InputField';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { protocol } from '@/config';
import { getDataNotProtected } from '@/functions';
import { GetCustomUserInter, GetPreInscriptionInter } from '@/Domain/Utils-H/userControl/userInter';
import { OpenGetCustomUserNotProtectedUrl, OpenGetPreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig';
import AdmissionForm from './[registration_number]/AdmissionForm';

const SchemaCreate = z.object({
    registration_number: z.string().optional(),
    dob: z.string().optional(),
    telephone: z.coerce.number().optional(),
    full_name: z.string().optional(),
});

type Inputs = z.infer<typeof SchemaCreate>;

const CheckForm = ({ params }: any) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const [clicked, setClicked] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [responseData, setResponseData] = useState<GetPreInscriptionInter>();
    const [customUserData, setCustomUserData] = useState<GetCustomUserInter>();
    const [foundPreInscriptionLength, setFoundPreInscriptionLength] = useState<number>(-1);
    const [foundUserLength, setFoundUserLength] = useState<number>(-1);

    const onSubmit = handleSubmit(async (formVals) => {
        setClicked(true);

        const searchCriteria = (registration_number?: any, full_name?: any, telephone?: any) => {
            if (registration_number && full_name) return { registration_number, full_name };
            if (registration_number && telephone) return { registration_number, telephone };
            if (full_name && telephone) return { full_name, telephone };
            return { telephone };
        };

        const queryData = searchCriteria(formVals.registration_number, formVals.full_name, formVals.telephone);

        if (queryData) {
            const response = await getDataNotProtected(
                `${protocol}api${params.domain}${OpenGetPreInscriptionUrl}`,
                { ...queryData },
                params.domain
            );

            if (response?.count === 1) {
                setFoundPreInscriptionLength(response.count);
                setResponseData(response.results[0]);

                const userResponse = await getDataNotProtected(
                    `${protocol}api${params.domain}${OpenGetCustomUserNotProtectedUrl}`,
                    { nopage: true, telephone: response.results[0].telephone },
                    params.domain
                );

                if (userResponse?.length === 1) {
                    setFoundUserLength(userResponse.length);
                    setPage(3);
                    setCustomUserData(userResponse[0]);
                } else {
                    setPage(2);
                    setFoundUserLength(userResponse.length);
                }
            } else {
                setFoundPreInscriptionLength(response.count || 0);
            }
        }
        setClicked(false);
    });

    return (
        <div className='md:border md:p-4 p-2 rounded-lg'>
            <h1 className='font-bold my-2 text-center text-xl'>Check Your Admission Status</h1>
            <p className='text-center text-gray-600 mb-4'>Enter your telephone number, full name, or registration number to verify your pre-enrollment or admission status.</p>

            {responseData && page === 2 ? (
                <div className='flex flex-col gap-2 h-full w-full'>
                    <h1 className='font-bold text-center text-xl'>Click Below to Download Your Pre-Enrollment Form</h1>
                    {/* <PreInscriptionForm data={responseData} params={params} /> */}
                </div>
            ) : responseData && page === 3 ? (
                <div className='flex flex-col gap-2 h-full w-full'>
                    {/* Animated Congratulations Text */}
                    <motion.h1
                        className='font-bold text-center text-xl text-teal-700'
                        initial={{ opacity: 0, y: -50 }}  // Start from invisible and above
                        animate={{
                            opacity: [0, 1, 0],             // Fade in and out
                            y: [-25, 0, 25],               // Move from above to normal to below
                        }}
                        transition={{
                            duration: 4,                   // Duration of one loop
                            repeat: Infinity,              // Loop infinitely
                            repeatType: 'reverse',         // Reverse the animation each time
                            ease: 'easeInOut',             // Smooth easing for the animation
                        }}
                    >
                        Congratulations! You Have Been Admitted
                    </motion.h1>
                    <AdmissionForm data={customUserData} params={params} />
                </div>
            ) : (
                <form onSubmit={onSubmit} className='flex flex-col gap-4 md:m-4'>
                    <InputField
                        label='Telephone'
                        label_two='Téléphone'
                        name='telephone'
                        register={register}
                        error={errors.telephone}
                        type='number'
                    />
                    <MyButtonModal type='update' title='Search' clicked={clicked} />

                    {foundPreInscriptionLength > 1 && (
                        <div className='bg-white font-bold text-center text-red-500 p-2 rounded'>
                            <span>Multiple results found. Please provide more details.</span>
                        </div>
                    )}
                    {foundPreInscriptionLength === 0 && (
                        <div className='bg-white font-bold text-center text-red-500 p-2 rounded'>
                            <span>No results found. Please check your information and try again.</span>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default CheckForm;
