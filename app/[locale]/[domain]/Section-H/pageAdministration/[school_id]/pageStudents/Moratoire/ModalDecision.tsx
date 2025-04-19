import { Milestone, NodeMoratoire } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';


interface Props {
    moratoire: NodeMoratoire;
    tab: number
    onClose: any;
}

const ModalDecision: React.FC<Props> = ({ moratoire, tab, onClose }) => {
    const deepClone = (schedule: Milestone[] = []): Milestone[] =>
        schedule.map((m) => ({ ...m }));

    const [approvedSchedule, setApprovedSchedule] = useState<Milestone[]>(
        moratoire?.approvedSchedule?.length
            ? deepClone(moratoire.approvedSchedule)
            : deepClone(moratoire.requestedSchedule)
    ); const [comment, setComment] = useState(moratoire.comment);

    const handleScheduleChange = (index: number, field: keyof Milestone, value: string | number) => {
        const newSch = [...approvedSchedule];
        if (field === 'amount') {
            newSch[index][field] = Number(value);
        } else {
            newSch[index][field] = value as string;
        }
        setApprovedSchedule(newSch);
    };

    const removeMilestone = (index: number) => {
        const updated = [...approvedSchedule];
        updated.splice(index, 1);
        setApprovedSchedule(updated);
    };

    const [createMoratoire] = useMutation(CREATE_DATA)

    const handleSubmit = async (status: "approve" | "reject") => {
        if (comment && comment?.length < 2) { alert("Reason for Approval or Rejection Required !!!"); return; }

        if (status) {
            const token = localStorage.getItem("token");
            const user = token ? jwtDecode<JwtPayload>(token) : null;

            const updatedMoratoire = {
                approvedSchedule: convertAndSerialize(approvedSchedule),
                comment,
                reason: moratoire.reason,
                id: parseInt(decodeUrlID(moratoire.id)),
                userprofileId: parseInt(decodeUrlID(moratoire.userprofile.id)),
                reviewedBy: user?.user_id,
                action: status,

            };

            try {
                const result = await createMoratoire({ variables: updatedMoratoire });
                const t = result?.data?.createUpdateMoratoire?.moratoire
                if (t?.id) {
                    alert(`Transaction Successful`)
                    window.location.reload()
                };
            } catch (err: any) {
                alert(`error creating:, ${err}`);
            }
        }
    };


    return (
        <motion.div
            className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center pt-20 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white max-w-[700px] p-4 relative rounded-lg shadow-lg w-full text-slate-800"
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
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    fontFamily: 'Arial, sans-serif',
                    background: '#fff'
                }}>
                    <h2 className='font-bold text-2xl text-center mb-2'>Moratoire Review</h2>
                    <p className='gap-4 flex'><strong className='font-bold text-lg tracking-wide italic'>Matricle:</strong>{moratoire.userprofile.user.matricle}</p>
                    <p className='gap-4 flex'><strong className='font-bold text-lg tracking-wide italic'>Student:</strong>{moratoire.userprofile.user.fullName}</p>
                    <p className='gap-4 flex'><strong className='font-bold text-lg tracking-wide italic'>Reason:</strong> {moratoire.reason}</p>

                    <div className='my-3'>
                        <h3 className='text-lg font-bold text-center my-2'>{tab === 0 ? "Requested" : tab === 1 ? "Approved" : "Rejected"} Schedule</h3>
                        {(tab < 1 ? approvedSchedule : (moratoire.approvedSchedule || approvedSchedule)).map((m, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span>{i + 1}</span>
                                <input
                                    type="number"
                                    value={m.amount}
                                    onChange={(e) => handleScheduleChange(i, 'amount', e.target.value)}
                                    placeholder="Amount"
                                    style={{ padding: '0.4rem', borderWidth: 1, borderRadius: 4 }}
                                />

                                <input
                                    type="date"
                                    value={m.dueDate}
                                    onChange={(e) => handleScheduleChange(i, 'dueDate', e.target.value)}
                                    style={{ padding: '0.4rem', flex: 1, borderWidth: 1, borderRadius: 4 }}
                                />
                                {tab < 1 ? <button onClick={() => removeMilestone(i)}><FaTimes color='red' size={24} /></button> : null}
                            </div>
                        ))}
                        {/* <button onClick={addMilestone} style={{ padding: '0.5rem 1rem', background: '#eee', borderRadius: '6px', border: '1px solid #ccc' }}>+ Add Milestone</button> */}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            readOnly={tab > 0}
                            placeholder="Reviewer's comment"
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>

                    {tab < 1 ? <div className='flex justify-between mt-4 gap-10'>
                        <button onClick={() => { handleSubmit("approve"); }} style={{ padding: '0.75rem 1.5rem', background: 'green', color: 'white', border: 'none', borderRadius: '6px' }}>Approve</button>
                        <button onClick={() => { handleSubmit("reject"); }} style={{ padding: '0.75rem 1.5rem', background: 'red', color: 'white', border: 'none', borderRadius: '6px' }}>Reject</button>
                    </div>
                        :
                        null}
                </div>

            </motion.div>
        </motion.div>
    );
};

export default ModalDecision;


const CREATE_DATA = gql`
    mutation CreateTransaction(
      $id: ID!
      $action: String!
      $userprofileId: ID!
      $reason: String!
      $comment: String!
      $reviewedBy: ID!
      $approvedSchedule: JSONString!
    ) {
      createUpdateMoratoire(
        id: $id
        action: $action
        userprofileId: $userprofileId
        reason: $reason
        comment: $comment
        reviewedBy: $reviewedBy
        approvedSchedule: $approvedSchedule
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