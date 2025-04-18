import { DashUserCardInter } from "@/Domain/Utils-H/dashControl/dashInter";
import Image from "next/image";

const UserCard = ({ data }: { data: DashUserCardInter }) => {
  const colors: string[] = ["bg-[#3BAFDA]", "bg-[#20C997]", "bg-[#967ADC]", "bg-[#3BAFDA]", "bg-[#A76571]", "bg-[#AEADF0]", "bg-[#A76571]", "bg-[#AEADF0]",]

  return (
    <div className={`text-slate-800 flex w-full flex-row p-4 rounded-2xl ${data.id == 1 ? colors[0] : data.id == 2 ? colors[1] : data.id == 3 ? colors[2] : colors[3]}`}>
      <div className="flex flex-col items-center justify-between text-lg w-full">
        <span className="font-medium px-2 py-[1px] text-[14px]">{data.date}</span>
        <h2 className="capitalize font-bold italic text-white tracking-widest">{data.type}</h2>
      </div>
      <div className="flex flex-col items-center justify-between w-full">
      {/* <Image src={data.icon} alt="" width={20} height={20} color="black" /> */}
        <div className="bg-white border flex font-semibold h-10 items-center justify-center my-2 rounded-xl text-2xl w-16">{data.count}</div>
      </div>
    </div>
  );
};

export default UserCard;
