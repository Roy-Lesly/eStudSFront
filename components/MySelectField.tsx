import Select, { MultiValue, SingleValue } from 'react-select';

type OptionType = { value: string | number; label: string };

type SelectFieldProps = {
  id: string;
  name: string;
  value: SingleValue<OptionType> | MultiValue<OptionType>;
  onChange: (value: SingleValue<OptionType> | MultiValue<OptionType>, action: any) => void;
  label: string;
  placeholder: string;
  defaultValue?: any;
  isMulti?: "select-single" | "select-multiple";
  required?: boolean;
  options?: string[] | { value: string | number; label: string }[];
  readOnly?: boolean;
  min?: number; // Add min
  max?: number; // Add max
};




const MySelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  defaultValue,
  isMulti = "select-single",
  required = false,
  options = [],
}) => {

  const multi = isMulti === "select-multiple";

  return (
    <div className="w-full">
      <label htmlFor={id} className="block font-medium text-black tracking-wide">
        {label}
      </label>

      <Select
        defaultValue={defaultValue}
        value={value}
        isMulti={multi}
        name={name}
        options={options}
        className="form-group basic-multi-select text-black font-medium"
        classNamePrefix="select"
        required={required}
        placeholder={placeholder}
        onChange={onChange}
      />

    </div>
  );
};

export default MySelectField;
