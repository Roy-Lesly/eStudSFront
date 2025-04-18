'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const Moratoire = ({ data, params }: { data: EdgeSchoolFees[], params: any }) => {
    console.log(data, 11)

    return (
        <div>Moratoire</div>
    );
};

export default Moratoire;
