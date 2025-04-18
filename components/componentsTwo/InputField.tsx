import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  label_two?: string;
  className?: string;
  readOnly?: boolean;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  label_two,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  readOnly,
  className,
}: InputFieldProps) => {
  return (
    <div className={`${className ? className : "flex "} flex-col gap-1 md:gap-2 w-full`}>
      <label className="text-gray-500">{label} {label_two ? "("+label_two+")" : ""}</label>
      <input
        type={type}
        readOnly={readOnly}
        {...register(name)}
        className={` active:border-primary bg-white border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 md:py-3 outline-none px-2 py-2 rounded-lg text-black transition w-full`}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="font-medium text-red text-xs">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
