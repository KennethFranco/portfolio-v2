import React from "react";

const Button = ({ children, disabled, variant, className, onClick }) => {
  return (
    <button
      className={`text-abc rounded-md hover:cursor-pointer duration-200 ${className} ${
        variant === "primary"
          ? "bg-red3 text-white hover:bg-red2 hover:text-white"
          : ""
      } ${
        disabled
          ? "bg-[#E5E5E5] text-[#6B7279] hover:bg-[#E5E5E5] hover:text-[#6B7279] hover:cursor-default"
          : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
