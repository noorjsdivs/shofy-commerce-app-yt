import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  type: string;
  placeholder: string;
  className?: string;
  name: string;
  required?: boolean;
}

const Input = ({ type, placeholder, className, name, required }: Props) => {
  return (
    <input
      className={twMerge(
        "border-2 border-slate-600 px-4 py-1 rounded-xs placeholder:text-black/50 text-black outline-hidden focus-visible:border-theme-color",
        className
      )}
      type={type}
      placeholder={placeholder}
      name={name}
      required={required}
    />
  );
};

export default Input;
