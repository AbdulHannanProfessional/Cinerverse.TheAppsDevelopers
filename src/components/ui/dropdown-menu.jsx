import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils';

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, className, ...props }) {
  const ctx = useContext(DropdownContext);
  return (
    <button
      type="button"
      className={cn('inline-flex items-center gap-2', className)}
      onClick={() => ctx?.setOpen(!ctx.open)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className, ...props }) {
  const ctx = useContext(DropdownContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn(
        'absolute right-0 mt-2 w-44 origin-top-right rounded-lg border border-border bg-[#0f131d] shadow-xl z-30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className, onClick, ...props }) {
  const ctx = useContext(DropdownContext);
  const handleClick = (e) => {
    onClick?.(e);
    ctx?.setOpen(false);
  };
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center px-4 py-2 text-left text-sm text-white hover:bg-white/5',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
