import { NodeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';


interface Props {
    schoolFee: NodeSchoolFees;
    onClose: any;
}

type MilestoneType = {
    amount: number;
    due_date: string;
}

const ModalApplication: React.FC<Props> = ({ schoolFee, onClose }) => {

    const [reason, setReason] = useState<string>()
    const [milestone, setMilestone] = useState<MilestoneType[]>([])
    const [createMoratoire] = useMutation(CREATE_DATA)

    const handleSubmit = async (status: "apply") => {
        if (!milestone || milestone.length === 0) {
            alert("Please add at least one milestone.");
            return;
        }

        // 1. Total Amount Validation
        const totalAmount = milestone.reduce((sum, m) => sum + Number(m.amount), 0);
        if (totalAmount !== schoolFee?.balance) {
            alert(`Total milestone amount must be exactly ${schoolFee.balance.toLocaleString()} F. Current total: ${totalAmount.toLocaleString()} F`);
            return;
        }
        if (!reason || (reason && reason?.length < 10)) { alert("Reason / Motif Required !!!"); return; }

        // 2. Due Date Validation (not more than 7 months from now)
        const acadYear = schoolFee.userprofile.specialty.academicYear.slice(5, 9)
        const now = new Date();
        const maxDate = new Date(`${acadYear}-05-20`)
        const minDate = new Date();
        minDate.setDate(now.getDate() + 7);

        for (let m of milestone) {
            const date = new Date(m.due_date);
            if (isNaN(date.getTime())) {
                alert(`"${m.due_date}" is not a valid date.`);
                return;
            }
            if (date > maxDate) {
                alert(`Due date ${m.due_date} exceeds ${maxDate}.`);
                return;
            }
            if (date < minDate) {
                alert(`Due date ${m.due_date} should exceed ${minDate.toISOString().slice(0, 10)}.`);
                return;
            }
        }

        if (status) {
            const newMoratoire = {
                requestedSchedule: JSON.stringify(milestone),
                reason: reason,
                userprofileId: parseInt(decodeUrlID(schoolFee.userprofile.id)),
                action: "apply",

            };

            try {
                const result = await createMoratoire({ variables: newMoratoire });
                console.log(result, 82)
                const t = result?.data?.createUpdateMoratoire?.moratoire
                if (t?.id) {
                    alert(`Transaction Successful`)
                    window.location.reload()
                };
            } catch (err: any) {
                console.log(err)
                alert(`error creating:, ${err}`);
            }
        }
    };

    const addMilestone = () => {
        setMilestone(prev => {
            if (prev.length >= 4) return prev; // Prevent adding more than 4
            return [...prev, { amount: 0, due_date: new Date().toISOString().split("T")[0] }];
        });
    };

    const removeMilestone = (index: number) => {
        setMilestone(prev => prev.filter((_, i) => i !== index));
    };

    const handleScheduleChange = (index: number, field: keyof MilestoneType, value: string | number) => {
        setMilestone(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) : value };
            return updated;
        });
    };


    return (
        <motion.div
            className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white max-w-lg p-2 relative rounded-lg shadow-lg w-full text-slate-800"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex font-bold gap-2 items-center text-blue-800 text-lg">

                    </h3>
                    <button
                        onClick={() => onClose()}
                        className="duration-150 hover:text-red-600 text-gray-500 transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div style={{
                    maxWidth: '800px',
                    margin: 'auto',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    fontFamily: 'Arial, sans-serif',
                    background: '#fff'
                }}>
                    <h2 className='font-bold text-2xl text-center mb-2'>Moratoire Application</h2>
                    <p className='gap-4 flex items-center'><strong className='font-bold text-lg tracking-wide italic'>Class:</strong>{schoolFee.userprofile.specialty?.mainSpecialty?.specialtyName}</p>
                    <p className='gap-4 flex items-center'><strong className='font-bold text-lg tracking-wide italic'>Year / Level:</strong>{schoolFee.userprofile.specialty?.academicYear} - {schoolFee.userprofile.specialty?.level?.level}</p>
                    <p className='gap-4 flex items-center'><strong className='font-bold text-lg tracking-wide italic'>Balance:</strong> {schoolFee.balance.toLocaleString()} F</p>

                    <div className=''>
                        <h3 className='text-lg font-bold text-center my-2'>Requested Schedule</h3>

                        {milestone.map((m, i) => (
                            <div key={i} className="flex gap-2 items-center mb-2">
                                <span>{i + 1}</span>
                                <input
                                    type="number"
                                    value={m.amount}
                                    onChange={(e) => handleScheduleChange(i, 'amount', e.target.value)}
                                    placeholder="Amount"
                                    className="py-1 px-2 w-2/5 border rounded"
                                />
                                <input
                                    type="date"
                                    value={m.due_date}
                                    onChange={(e) => handleScheduleChange(i, 'due_date', e.target.value)}
                                    className="py-1 px-2 w-2/5 border rounded flex-1"
                                />
                                <button onClick={() => removeMilestone(i)} className="text-red-600 hover:text-red-800"><FaTimes /></button>
                            </div>
                        ))}


                        <div className='w-full flex items-center justify-center'>
                            <button
                                disabled={milestone.length >= 4}
                                onClick={addMilestone}
                                className='p-2 bg-green-300 rounded-full border-1'>
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '0.4rem' }}>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Type Your Motif Here"
                            rows={3}
                            style={{ width: '100%', padding: '0.3rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div className='flex justify-center mt-10 gap-10'>
                        <button
                            className='tracking-widest rounded-lg text-lg px-6 py-2 font-semibold bg-green-700 text-white'
                            onClick={() => { handleSubmit("apply"); }}
                        >
                            Apply
                        </button>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default ModalApplication;


const CREATE_DATA = gql`
    mutation CreateTransaction(
      $action: String!
      $userprofileId: ID!
      $reason: String!
      $requestedSchedule: JSONString!
    ) {
      createUpdateMoratoire(
        action: $action
        userprofileId: $userprofileId
        reason: $reason
        requestedSchedule: $requestedSchedule
    ) {
        moratoire {
            id
            status
        }
    }
    }
  `;


const toSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertAndSerialize = (arr: any[]): string => {
    const cleaned = arr.map(item => {
        const { __typename, ...rest } = item;
        const snakeCased: any = {};
        Object.entries(rest).forEach(([key, value]) => {
            snakeCased[toSnakeCase(key)] = value;
        });
        return snakeCased;
    });
    return JSON.stringify(cleaned);
};