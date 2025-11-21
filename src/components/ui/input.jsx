import React from 'react';
import { cn } from '@/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-border bg-[#0f131d] px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
