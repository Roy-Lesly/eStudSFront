type InputFieldProps = {
  id: string;
  name: string;
  value: string | string[]; // Allow both string and string[] for value
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  label: string;
  placeholder: string;
  type?: "text" | "textArea" | "select" | "select-multiple" | "number" | "date" | 'email' | 'password';
  required?: boolean;
  options?: string[] | { id: string | number; name: string }[];
  readOnly?: boolean;
  min?: number; // Add min
  max?: number; // Add max
};




const MyInputField: React.FC<InputFieldProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  required = false,
  options = [],
  readOnly = false,
  max,
  min
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
        return (options as { id: string | number; name: string }[]).map((option, index) => (
          <option key={option.id + `-${index}`} value={option.id}>
            {option.name}
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
      {type === 'textArea' ? (
        <textarea
          id={id}
          name={name}
          value={value as string} // Ensure value is treated as string for textareas
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className="border focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg w-full"
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value as string} // Ensure value is treated as string for single select
          onChange={onChange}
          required={required}
          disabled={readOnly}
          className="border focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg text-black w-full"
        >
          <option value="">Select {label}</option>
          {renderOptions()}
        </select>
      ) : type === 'select-multiple' ? (
        <select
          id={id}
          name={name}
          value={value as string[] | string} // Handle string[] for multi-select
          onChange={onChange}
          required={required}
          multiple
          disabled={readOnly}
          className="border focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg text-black w-full"
        >
          <option value="">Select {label}</option>
          {renderOptions()}
        </select>
      ) : type === 'date' ? (
        <input
          type="date"
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          className="border focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg w-full"
        />
      ) : type === "email" ? (
        <input
          type="email"
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          className="border focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg w-full"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value as string} // Ensure value is treated as string for input
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          min={min}
          max={max}
          className="border border-gray-700 focus:border-blue-500 focus:ring-blue-500 font-medium p-2 rounded-md shadow-lg w-full"
        />
      )}
    </div>
  );
};

export default MyInputField;
