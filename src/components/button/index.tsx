import React from 'react';
import cn from 'classnames';
import s from './style.module.css';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, className, ...rest }: IButtonProps) => {
  return (
    <button className={cn(s.btn, className)} {...rest}>
      {children}
    </button>
  );
};
