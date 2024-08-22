import React from "react";

interface CardProps {
  title?: string;
  values?: { active: number, inactive: number };
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const CountCard: React.FC<CardProps> = ({ title, values, icon, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 justify-between flex flex-row gap-2 min-w-[150px]">
      <div className="flex flex-col items-center justify-between">
        <div className="text-gray-900 font-medium">{title}</div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="flex flex-col items-center justify-between">
        <div className="text-xl font-semibold text-green-700">{values?.active}</div>
        <div className="text-xl font-semibold text-red">{values?.inactive ? values?.inactive : "-"}</div>
      </div>
      {children}
    </div>
  );
};

export default CountCard;
