'use client';

import {
    Users,
    UserCheck,
    UserPlus,
    DollarSign,
} from 'lucide-react';
import Card from '../comps/Card';


const Display = ({ data }: { data: any }) => {

    // console.log(data);

    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data ? <>
            <Card title="Staff" values={data.staffs} icon={<Users />} />
            <Card title="Lecturers" values={data.teachers} icon={<UserCheck />} />
            <Card title="Students" values={data.students} icon={<UserPlus />} />
        </>
            :
            <div>No Data</div>
        }
    </div>
    );
};

export default Display;
