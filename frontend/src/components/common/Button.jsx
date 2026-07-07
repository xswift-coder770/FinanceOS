const Button = ({ text }) => {
  return (

    <button
      className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
    >
      {text}
    </button>

  );
};

export default Button;