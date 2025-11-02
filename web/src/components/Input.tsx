'use client';

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return 'border-error focus:ring-error';
    return 'border-border focus:ring-primary';
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold text-text mb-1" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full h-12 px-4
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            bg-surface
            text-text text-base
            border rounded-md
            transition-colors
            placeholder:text-text-light
            focus:outline-none focus:ring-2
            disabled:bg-background-dark disabled:cursor-not-allowed
            ${getBorderColor()}
            ${className}
          `}
          onFocus={e => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
            disabled={!onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-text-secondary">{helperText}</p>}
    </div>
  );
};
