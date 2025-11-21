import React from 'react';
import { cn } from '@/utils';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

export function Button({ className, variant = 'primary', disabled, ...props }) {
  const styles = {
    primary:
      'bg-accent text-[#0A0E17] hover:bg-[#c79b00] focus-visible:outline-[#F5C518] disabled:opacity-60',
    ghost:
      'bg-transparent text-white border border-border hover:border-accent hover:text-accent disabled:opacity-60',
    subtle:
      'bg-white/5 text-white hover:bg-white/10 border border-transparent disabled:opacity-60',
  };

  return (
    <button
      className={cn(base, styles[variant] || styles.primary, className)}
      disabled={disabled}
      {...props}
    />
  );
}
