// components/Button.tsx
import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The label or elements to display inside the button
   */
  children: React.ReactNode;
  /**
   * Optional additional Tailwind classes
   */
  className?: string;
}

/**
 * A pill-shaped, reusable Button component with built-in polish:
 * - Smooth hover shrink (hover:scale-95) for a grounded feel
 * - Active press further shrink (active:scale-90) for tactile feedback
 * - Click-to-circle: on click, transitions to a circular, text-free state
 * - Soft shadow and focus ring for accessibility and depth
 * - Transition timing for micro-interactions
 * - Uses CSS variable --color-heavy-start for background color
 */
export default function Button({ children, className = '', onClick, ...props }: ButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      style={{ backgroundColor: 'var(--color-heavy-start)' }}
      className={
        `${clicked ? 'h-10 w-10 px-0 py-0 rounded-full' : 'px-4 py-2 rounded-full'} ` +
        `text-white font-medium shadow-md transition-all duration-150 ease-in-out ` +
        `${clicked ? '' : 'hover:scale-95 active:scale-90'} ` +
        `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`
      }
      {...props}
    >
      {!clicked && children}
    </button>
  );
}
