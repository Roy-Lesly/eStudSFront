'use client';

import React, { useState } from 'react';
import { EdgeComplain, EdgeUserProfile } from '@/utils/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import MyTableComp from '@/components/Table/MyTableComp';
import ModalCUDComplain from '@/components/MyModals/ModalCUDComplain';
import MyModal from '@/components/MyModals/MyModal';
import { decodeUrlID } from '@/utils/functions';



const DisplayComplains = (
    { p, dataComplains, profile, apiComplainNames }:
        { p: any; dataComplains: EdgeComplain[], profile: EdgeUserProfile, apiComplainNames: string[] }
) => {

    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState<{ show: boolean, type: "update" | "create" | "delete" }>();
    const [selectedItem, setSelectedItem] = useState<EdgeComplain | null>(null);

    const trimmedData = dataComplains?.map((row) => ({
        ...row,
        node: {
            ...row.node,
            shortMessage: row.node.message?.length > 25
                ? row.node.message.slice(0, 25) + "..."
                : row.node.message,
        },
    }));

    console.log(dataComplains);

    const Columns: TableColumn<EdgeComplain>[] = [
        { header: `${t("Message")}`, accessor: "node.shortMessage", align: "left", },
        {
            header: `${t("Status")}`, align: "left", render: (item) => <button
                className=""
            >
                {item.node.status ? "OK" : "Pending"}
            </button>,
        },
        {
            header: `${t("Edit")}`, align: "center",
            render: (item) => <button
                className="bg-green-200 p-2 rounded-full"
                onClick={() => { setShowModal({ type: "update", show: true }); setSelectedItem(item); }}
            >
                <FaRightLong color="green" size={21} />
            </button>,
        },
    ];

    return (
        <div className="bg-slate-100 flex flex-col items-center justify-center mt-16 py-4 px-2">

            <div className="bg-white rounded shadow-lg w-full">

                {dataComplains ?
                    <MyTableComp
                        data={
                            trimmedData?.sort((a: EdgeComplain, b: EdgeComplain) => {
                                const statusA = a.node.status;
                                const statusB = b.node.status;
                                const endingAtA = a.node.endingAt;
                                const endingAtB = b.node.endingAt;

                                if (statusA > statusB) return -1;
                                if (statusA < statusB) return 1;

                                return endingAtA.localeCompare(endingAtB);
                            })}
                        columns={Columns}
                        table_title={`${t("My Complains")}`}
                        button_action={() => { setShowModal({ type: "create", show: true }) }}
                        button_type={"add"}
                    />
                    :
                    <div className='flex flex-col gap-16 items-center justify-center  py-20 '>
                        <span className='text-red rounded py-2 px-6 tracking-wider text-2xl font-bold'>{t("No Complains Found")}</span>
                    </div>
                }
            </div>

            <MyModal
                component={
                    <ModalCUDComplain
                        params={p}
                        source={"student"}
                        setOpenModal={setShowModal}
                        actionType={showModal?.type || "create"}
                        selectedItem={showModal?.type === "create" ? null : selectedItem}
                        section={"Higher"}
                        apiComplainNames={apiComplainNames}
                        profile={profile?.node}
                    />
                }
                openState={showModal?.show || false}
                onClose={() => setShowModal({ show: false, type: "create" })}
                title={showModal?.type || ""}
                classname=''
            />

        </div>
    );
};

export default DisplayComplains;