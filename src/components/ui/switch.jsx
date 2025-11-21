import React from 'react';
import { cn } from '@/utils';

export function Switch({ checked, onCheckedChange, className, ...props }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition',
        checked ? 'bg-accent/80' : 'bg-border',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white transition',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  );
}
