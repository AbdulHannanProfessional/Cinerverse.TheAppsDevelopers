import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils';

const SelectContext = createContext(null);

export function Select({ value, defaultValue, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const triggerRef = useRef(null);
  const selected = value ?? internal;

  const api = useMemo(
    () => ({
      open,
      setOpen,
      value: selected,
      onSelect: (next) => {
        if (onValueChange) onValueChange(next);
        if (value === undefined) setInternal(next);
        setOpen(false);
      },
      triggerRef,
    }),
    [open, onValueChange, selected, value],
  );

  return <SelectContext.Provider value={api}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      ref={ctx?.triggerRef}
      onClick={() => ctx?.setOpen(!ctx.open)}
      className={cn(
        'w-full rounded-lg border border-border bg-[#0f131d] px-3 py-2 text-left text-sm text-white flex items-center justify-between gap-2',
        className,
      )}
      {...props}
    >
      {children}
      <span className="text-xs text-muted">▾</span>
    </button>
  );
}

export function SelectContent({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;

  return (
    <div
      className={cn(
        'relative z-20 mt-2 w-full rounded-lg border border-border bg-[#0f131d] shadow-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  const ctx = useContext(SelectContext);
  const isActive = ctx?.value === value;
  return (
    <div
      onClick={() => ctx?.onSelect(value)}
      className={cn(
        'px-3 py-2 cursor-pointer text-sm hover:bg-white/5',
        isActive && 'text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  return <span className={cn(!ctx?.value && 'text-muted')}>{ctx?.value || placeholder}</span>;
}
