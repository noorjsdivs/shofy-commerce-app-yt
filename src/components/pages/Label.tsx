import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label = ({ children, htmlFor, className }: Props) => {
  return (
    <label htmlFor={htmlFor} className={twMerge("font-semibold", className)}>
      {children}
    </label>
  );
};

export default Label;
