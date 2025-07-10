'use client';
import React, { useEffect, useState } from 'react';
import InputField from '@/componentsTwo/InputField';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { removeEmptyFields } from '@/functions';
import { EdgePreInscription } from '@/utils/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const SchemaCreate = z.object({
    registration_number: z.string().optional(),
    dob: z.string().optional(),
    telephone: z.coerce.number().optional(),
    full_name: z.string().optional(),
});

type Inputs = z.infer<typeof SchemaCreate>;

const CheckForm = ({ data, p, sp }: { data: EdgePreInscription[], p: any, sp: any }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const { t } = useTranslation("common");
    const [clicked, setClicked] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false);
    const router = useRouter();
    const [foundPreInscriptionLength, setFoundPreInscriptionLength] = useState<number>(-1);

    const onSubmit = handleSubmit(async (formVals) => {
        setClicked(true);
        setSearching(true);
        const queryString = new URLSearchParams(removeEmptyFields(formVals)).toString();
        router.push(`/${p.locale}/${p.domain}/pre-inscription/Check/?${queryString}`)
    });

    useEffect(() => {
        console.log(searching, data?.length);
        console.log(data);
        if (data && data.length > 1) {
            setFoundPreInscriptionLength(data.length);
            setSearching(false);
            setClicked(false);
        }
        if (searching && data && data.length === 1 && !data[0].node.admissionStatus) {
            router.push(`/${p.locale}/${p.domain}/pre-inscription/Check/Registered/?telephone=${sp?.telephone}`);
            setSearching(false);
        }
        else if (searching && data && data.length === 1 && data[0].node.admissionStatus) {
            router.push(`/${p.locale}/${p.domain}/pre-inscription/Check/Admitted/?telephone=${sp?.telephone}`);
            setSearching(false);
        }
        else {
            setSearching(false);
            setClicked(false);
        }
    }, [data])

    return (
        <div className='md:border md:p-4 p-2 rounded-lg'>
            <h1 className='font-bold my-2 text-center text-xl'>{t("Check Your Admission Status")}</h1>
            <p className='text-center text-gray-600 mb-4'>{t("Enter your telephone number to verify your pre-enrollment or admission status")}.</p>
            <form onSubmit={onSubmit} className='flex flex-col gap-4 md:m-4'>
                <InputField
                    label='Telephone'
                    label_two='Téléphone'
                    name='telephone'
                    defaultValue={sp?.telephone || ""}
                    register={register}
                    error={errors.telephone}
                    type='number'
                />
                <MyButtonModal type='update' title='Search' clicked={clicked} />

                {foundPreInscriptionLength > 1 && (
                    <div className='bg-white font-bold text-center text-red-500 px-2 py-10 rounded'>
                        <span className='text-red'>{t("Multiple results found")}.</span>
                        <span className='text-red'>{t("Please provide more details")}.</span>
                    </div>
                )}
                {foundPreInscriptionLength === 0 && (
                    <div className='bg-white font-bold text-center text-red-500 p-2 rounded'>
                        <span>{t("No results found")}.</span>
                        <span>{t("Please check your information and try again")}.</span>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CheckForm;
