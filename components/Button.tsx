"use client";
import { FC, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, disabled }) => {
    return (

        <button
            onClick={onClick}
            disabled={disabled}
            className="
        px-6 py-2 rounded-lg font-medium
      bg-black text-white
      hover:bg-stone-800
      active:scale-[0.98]
      disabled:opacity-40 disabled:cursor-not-allowed
      transition-all
      "
        >
            {children}
        </button>
    );
};

export default Button;