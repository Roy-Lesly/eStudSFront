import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  data: any;
  label_two?: string;
  display?: { name?: string, value?: string };
  defaultValue?: string;
  defaultName?: string;
  error?: FieldError;
  functions?: any;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const SelectField = ({
  label,
  label_two,
  type = "text",
  register,
  name,
  defaultValue,
  defaultName,
  error,
  inputProps,
  data,
  display,
  functions,
  className
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full" key={name}>
      <label className="text-gray-500">{label} {label_two ? "("+label_two+")" : ""}</label>
      <select
        {...register(name)}
        className={`relative z-20 w-full appearance-none border  bg-white bg-transparent px-2 md:px-4 py-1 md:py-2 rounded outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white ${className ? className : "text-black dark:text-white"}`}
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

export default SelectField;
