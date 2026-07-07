const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange
}) => {

  return (

    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="border border-gray-300 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
    />

  );
};

export default InputField;