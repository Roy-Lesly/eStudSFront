"use client";
import React, { useState } from 'react';
import BackGround from '../BackGround';
import { EdgeSchoolInfoHigher } from '@/utils/Domain/schemas/interfaceGraphql';
import { ActionResetPassword } from '@/utils/serverActions/AuthActions';
import { protocol } from '@/utils/config';
import { ResetPasswordEmail } from '@/utils/Domain/configDom';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from './ForgotPasswordForm';

const Display = ({ p, school }: { p: any, school: EdgeSchoolInfoHigher }) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const [formData, setFormData] = useState({
        email: "",
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
        var email = formData.email
        const data = {
            email: email?.toString().toLowerCase(),
        }
        const response = await ActionResetPassword(data, protocol + "api" + p.domain + ResetPasswordEmail)
        console.log(34, response)
        if (response?.errors) { Swal.fire(response.errors); setLoading(false); }
        if (response?.email?.length) {
            Swal.fire(response?.email[0])
        }
        if (response?.error) {
            if (JSON.stringify(response.error).includes("(535, b'Incorrect authentication data')")) {
                setLoading(false);
                Swal.fire("An Error Occured")
                router.push(`/pageAuthentication/ResetPassword?error=An Error Occured`)
            }
        }
        if (response?.email) {
            if (JSON.stringify(response.email).includes("We couldn't find an account associated with that email")) {
                Swal.fire("No account associated with this email")
                router.push(`/pageAuthentication/ResetPassword?error=No account associated with that email`)
            }
        }
        if (response?.status == "OK") {
            Swal.fire("Check Your Email for The Token")
            router.push(`/${p.domain}/pageAuthentication/PasswordAndToken`)
        }
        setLoading(false)
    }


    return (
        <BackGround>
            <ForgotPasswordForm
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
