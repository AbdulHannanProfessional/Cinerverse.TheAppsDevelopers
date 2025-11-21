import React, { createContext, useContext, useMemo, useState } from 'react';
import { cn } from '@/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [internal, setInternal] = useState(defaultValue);
  const activeValue = value ?? internal;

  const api = useMemo(
    () => ({
      value: activeValue,
      setValue: (next) => {
        if (onValueChange) onValueChange(next);
        if (value === undefined) setInternal(next);
      },
    }),
    [activeValue, onValueChange, value],
  );

  return (
    <TabsContext.Provider value={api}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl bg-surface/60 p-1 border border-border',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={cn(
        'px-4 py-2 text-sm font-semibold rounded-lg transition',
        isActive ? 'bg-accent text-[#0A0E17]' : 'text-muted hover:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div className={cn('pt-2', className)} {...props}>
      {children}
    </div>
  );
}
