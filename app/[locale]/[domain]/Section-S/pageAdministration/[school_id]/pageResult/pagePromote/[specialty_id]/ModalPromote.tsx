import { EdgeUserProfile } from "@/Domain/schemas/interfaceGraphql";
import React, { FC } from "react";

interface ModalProps {
  profilesToPromote: EdgeUserProfile[];
  onCancel: () => void;
  onPromote: () => void;
}

const ModalPromote: FC<ModalProps> = ({ profilesToPromote, onCancel, onPromote }) => {
  return (
    <div className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50">
      <div className="bg-white max-w-lg p-6 rounded-lg shadow-lg w-full">
        <h2 className="font-bold items-centr justify-center text-2xl text-center">Confirm Promotion</h2>
        <h2 className="font-bold gap-4 items-centr justify-center my-4 text-center text-lg">From Level-{profilesToPromote[0].node.specialty.level.level} to Level-{profilesToPromote[0].node.specialty.level.level + 100}</h2>

        <div className="max-h-60 overflow-y-auto">
          <ul className="space-y-1">
            {profilesToPromote.map((profile, index) => (
              <li key={profile.node.id} className="bg-gray-100 flex items-center justify-between p-1 rounded">
                <div>
                  <p className="font-semibold">{profile.node.customuser.fullName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={onCancel}
            className="bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onPromote}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPromote;
