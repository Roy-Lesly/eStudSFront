"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import SelectField from "../SelectField";
import InputField from "../InputField";
import { makePayment } from "@/serverActions/formActions";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditSchoolFees } from "@/Domain/schemas/schemas";
import { protocol } from "@/config";
import { SchoolFeesUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { CircularProgressbar } from "react-circular-progressbar";
import { decodeUrlID } from "@/functions";
import { gql, useMutation } from "@apollo/client";
import getApolloClient from "@/utils/graphql/GetAppolloClient";
import { NodeSchoolFeesSec } from "@/utils/Domain/schemas/interfaceGraphqlSecondary";
import { useTranslation } from "react-i18next";


const SchemaCreate = z.object({
    amount: z.coerce.number().int().gte(10).lte(300000),
    operator: z.enum(["MTN", "ORANGE", "DIRECT"]),
    telephone: z.coerce.number().int().gte(610000000).lte(999999999),
})

type Inputs = z.infer<typeof SchemaCreate>;

const PayPlatFormAndIdCardFormSec = ({
    type,
    data,
    params,
    setOpen,
    extra_data,
}: {
    type: "custom";
    extra_data: { onActivate: any, url: string, reason: "platform_charges" | "id_card" };
    params: any;
    data: NodeSchoolFeesSec[];
    setOpen?: any;
}) => {

    console.log(data[0].id);

    const client = useMemo(() => getApolloClient(params.domain), [params.domain]);
    const [createTransaction, { loading: creatingLoading, error: errorCreating, data: createdData }] = useMutation(
        CREATE_TRANSACTION,
        { client }
    );



    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const router = useRouter();
    const { t } = useTranslation("common");
    const [clicked, setClicked] = useState<boolean>(false);
    const [processingLevel, setProcessingLevel] = useState<number>(0);

    const onSubmit = handleSubmit((formVals) => {
        setProcessingLevel(1)
        const newData: { amount: number, service: string, telephone: number } = {
            amount: formVals.amount,
            service: formVals.operator,
            telephone: parseInt(formVals.telephone.toString()),
        }

        // Multiple
        if (data && data.length && newData.amount && newData.service && newData.telephone) {
            setClicked(true);
            const call = async () => {
                const response = await makePayment(newData);

                // IF API RESPONSE
                if (response && response.success) {

                    // IF SUCCESSFUL RESPONSE
                    if (response.pay.operation) {
                        let newData: any = { platform_paid: false, id_paid: false }
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            if (extra_data.reason == "id_card") { newData["id_paid"] = true, newData["platform_paid"] = element.platformPaid }
                            if (extra_data.reason == "platform_charges") { newData["platform_paid"] = true, newData["id_paid"] = element.idPaid }
                            const response2 = await ActionEdit({
                                ...newData,
                                balance: element.balance,
                                userprofile_id: parseInt(decodeUrlID(element.userprofilesec.id)),
                            },
                                parseInt(decodeUrlID(element.id.toString())),
                                SchemaCreateEditSchoolFees, protocol + "api" + params.domain + SchoolFeesUrl,
                                params.domain
                            )
                            setProcessingLevel((index + 1 / data.length + 1) * 100)
                            if (response2 && response2.id && extra_data.reason == "platform_charges") {
                                router.push(`/${extra_data?.url}?customsuccess=Activated !!!`);
                                setClicked(false)
                            }
                            if (response2 && response2.id && extra_data.reason == "id_card") {
                                try {
                                    console.log("response2 10")
                                    const result = await createTransaction({
                                        variables: {
                                            input: {
                                                schoolfeesId: parseInt(decodeUrlID(element.id.toString())),
                                                amount: element.userprofilesec?.classroomsec.school.schoolIdentification.idCharges,
                                                paymentMethod: "DIRECT",
                                                status: "Completed",
                                                reason: "ID CARD",
                                                account: "ID CARD",
                                            },
                                        },
                                    });
                                    console.log("114 Mutation result:", result);
                                    // alert("Application submitted successfully!");
                                    if (index == data.length - 1) {
                                        router.push(`/${extra_data?.url}/?customsuccess=Activated !!!`);
                                    }
                                } catch (error: any) {
                                    console.error("74 Mutation error:", error);
                                    if (typeof errorCreating == "object" && errorCreating.name) { }
                                    // alert("Failed to submit application. Please try again.");
                                }
                                setClicked(false)
                            }
                            console.log("response 124")
                        }
                    }

                    // IF RROR RESPONSE
                    if (!response.pay.operation) {
                        router.push(`/${extra_data?.url}?customerror=${response.pay.transaction} !!!`);
                        setClicked(false)
                    }
                }

                // IF RROR RESPONSE
                if (response && response.error) {
                    router.push(`/${extra_data?.url}?customerror=${response.error} !!!`);
                    setClicked(false)
                }
            }
            call()
        }
    })

    const SubmitButton = () => {
        return <MyButtonModal type={"custom"} title="ACTIVATE" clicked={clicked} className="bg-blue-300" />
    }

    console.log(data);

    return (
        <>
            {data && data.length > 0 ? (
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    {data.length > 1 ? (
                        <div className="font-bold items-center justify-center text-2xl text-center">
                            {t("Total Accounts")} - {data.length}
                        </div>
                    ) : (
                        <div className="font-bold items-center justify-center text-2xl text-center">
                            {data[0].userprofilesec?.customuser?.fullName} - {data[0].userprofilesec?.customuser?.matricle || "N/A"}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 justify-between">
                        <SelectField
                            label="MOBILE OPERATOR"
                            name="operator"
                            register={register}
                            error={errors?.operator}
                            data={["MTN", "ORANGE"]}
                        />

                        <InputField
                            label="Amount"
                            name="amount"
                            defaultValue={
                                extra_data.reason === "platform_charges"
                                    ? data?.reduce((sum, item) =>
                                        sum + (item?.userprofilesec?.classroomsec?.school?.schoolIdentification?.platformCharges || 0), 0
                                    ).toString()
                                    : data?.reduce((sum, item) =>
                                        sum + (item?.userprofilesec?.classroomsec?.school?.schoolIdentification?.idCharges || 0), 0
                                    ).toString()
                            }
                            register={register}
                            error={errors?.amount}
                            readOnly
                        />

                        <InputField
                            label="Telephone"
                            name="telephone"
                            register={register}
                            error={errors?.telephone}
                        />

                        <InputField
                            label="ORIGIN"
                            name="origin"
                            register={register}
                            defaultValue="admin"
                            readOnly
                            className="hidden"
                        />
                    </div>

                    <div className="flex flex-row gap-4 items-center justify-center w-full">
                        <SubmitButton />
                        {processingLevel ? (
                            <div className="flex font-bold h-16 items-center justify-center text-[20px] w-16">
                                <CircularProgressbar value={processingLevel} text={`${processingLevel} %`} />
                            </div>
                        ) : null}
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
                    <div>Soon ...</div>
                </div>
            )}
        </>

    );
};

export default PayPlatFormAndIdCardFormSec;


const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      transaction {
        id
        amount
        reason
        schoolfees {
            userprofile {
                user {
                    id
                    fullName
                }
            }
        }
        status
      }
    }
  }
`;

