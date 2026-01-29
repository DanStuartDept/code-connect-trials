import React from 'react';

interface ButtonProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      type="button"
      className="cursor-pointer inline-flex items-center justify-center bg-black px-4 py-1 text-white text-[18px] font-semibold leading-[28px]"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
