import Select from 'react-select';


type SelectFieldProps = {
  id: string;
  name: string;
  value: string | string[]; // Allow both string and string[] for value
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any;
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
  isMulti,
  required = false,
  options = [],
}) => {

    const renderOptions = () => {
    if (Array.isArray(options)) {
      if (typeof options[0] === 'string') {
        return (options as string[]).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ));
      } else if (typeof options[0] === 'object' && options[0] !== null) {
        return (options as { value: string | number; label: string }[]).map((option, index) => (
          <option key={option.value + `-${index}`} value={option.value}>
            {option.label}
          </option>
        ));
      }
    }
    return null;
  };

  return (
    <div className="mt-2 w-full">
      <label htmlFor={id} className="block font-medium mt-1 text-black text-gray-700 tracking-wide">
        {label}
      </label>

      <Select
        defaultValue={defaultValue}
        value={value}
        isMulti={isMulti === "select-single"}
        name={name}
        options={options}
        className="form-group basic-multi-select text-black font-medium"
        classNamePrefix="select"
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(name, parseInt(e?.value || ""))}
      />

    </div>
  );
};

export default MySelectField;
