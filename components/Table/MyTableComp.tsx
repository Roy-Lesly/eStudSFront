import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

interface TableColumn<T> {
  header: string;
  accessor?: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
  responsiveHidden?: boolean; // NEW: Control visibility on small screens
  hideColumn?: boolean; // NEW: Control visibility on small screens
}

interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (item: T, index: number) => string | number;
  rowVariants?: any;
  enableHover?: boolean;
  striped?: boolean;
  table_title?: string;
  button_type?: "add" | "edit" | null
  button_action?: any
  setActionType?: any
  custom_button?: any
}

// Helper function to access nested properties safely
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) ?? "-";
};

const MyTableComp = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  rowVariants,
  enableHover = true,
  striped = true,
  table_title,
  button_action,
  button_type = null,
  custom_button = null,
  setActionType = () => String
}: ReusableTableProps<T>) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="flex items-center justify-between mx-2 mb-2">
        <h2 className="font-bold text-lg uppercase">{table_title}</h2>
        {custom_button}
        {button_type ? <>
          {button_type === "add" && <button className='bg-green-500 p-1 rounded-full' onClick={() => { button_action(true); setActionType("create")} }><FaPlus size={25} color="white" /></button>}
          {button_type === "edit" && <button className='bg-blue-500 p-1 rounded-full' onClick={() => { button_action(true); setActionType("edit")} }><FaPlus size={25} color="white" /></button>}
        </>
          :
          null}

      </div>
      <table className="border border-collapse border-gray-300 shadow-md table-auto w-full">
        <thead className="bg-slate-800">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`border border-slate-300 font-semibold text-lg px-4 py-2 text-${col.align || "left"} text-slate-50 ${
                  col.hideColumn ? "hidden" : col.responsiveHidden ? "hidden md:table-cell" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.map((item, index) => (
            <motion.tr
              key={rowKey ? rowKey(item, index) : index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              className={`
                ${striped && index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                ${enableHover ? "hover:bg-slate-300" : ""}
              `}
            >
              {columns.map((col, colIndex) => {
                const cellContent = col.render
                  ? col.render(item, index)
                  : col.accessor
                  ? getNestedValue(item, col.accessor)
                  : "-";

                return (
                  <td
                    key={colIndex}
                    className={`border border-slate-300 text-slate-900 font-medium px-4 py-2 text-${col.align || "left"} ${
                      col.hideColumn ? "hidden" : col.responsiveHidden ? "hidden md:table-cell" : ""
                    }`}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTableComp;
