import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  data: any;
  display?: { name?: string, value?: string };
  defaultValue?: string;
  defaultName?: string;
  error?: FieldError;
  functions?: any;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const MultipleSelectField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  defaultName,
  error,
  inputProps,
  data,
  display,
  functions
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-500">{label}</label>
      <select
        multiple
        {...register(name)}
        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-1 md:py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""}`}
        {...inputProps}
        defaultValue={defaultValue}
        onChange={(e) => { functions && functions[1](e.target.value); functions && functions[0](functions[2]) }}
      >
        {defaultValue ? defaultName ? <option value={defaultValue}>{defaultName}</option> : <option value={defaultValue}>{defaultValue}</option> : <option value="">-------------------</option>}
        {data && data.map((item: any) => {
          if (display && display.name) {
            return <option key={item[`${display.value}`]} value={item[`${display.value}`]}>{item[`${display.name}`]}</option>
          } else {
            return <option key={item} value={item}>{item}</option>
          }
        })}
      </select>
      {error?.message && (
        <p className="font-medium text-red text-xs">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default MultipleSelectField;
