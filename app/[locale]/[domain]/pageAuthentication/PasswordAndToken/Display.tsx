"use client";
import React, { useState } from 'react';
import BackGround from '../BackGround';
import ResetPasswordForm from './ResetPasswordForm';
import { EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import { ActionConfirmResetPassword, ActionResetPassword } from '@/utils/serverActions/AuthActions';
import { protocol } from '@/utils/config';
import { ResetPasswordEmail } from '@/utils/Domain/configDom';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { ResetPasswordConfirmUrl } from '@/utils/Domain/Utils-H/userControl/userConfig';

const Display = ({ p, school }: { p: any, school: EdgeSchoolHigherInfo }) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const [formData, setFormData] = useState({
        token: "",
        password: "",
        confirm_password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const response = await ActionConfirmResetPassword(
            formData,
            `${protocol}api${p.domain}${ResetPasswordConfirmUrl}`
        );
        console.log(34, response)
        if (response?.status === 'OK') {
            Swal.fire({
                title: 'Password Reset Successfully!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
            });
            router.push('/pageAuthentication/Login');
            return;
        }
        if (response?.password?.length) {
            alert(response.password.map((msg: string) => `${msg} ❌`).join('\n'));
        }
        if (response?.detail) {
            alert(response.detail);
        }
        else {
            Swal.fire({
                title: response?.error || 'Something went wrong!',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
        }

        setLoading(false);
    };


    return (
        <BackGround>
            <ResetPasswordForm
                params={p}
                handleSubmit={handleSubmit}
                school={school}
                loading={loading}
                handleChange={handleChange}
            />
        </BackGround>
    );
}

export default Display;
