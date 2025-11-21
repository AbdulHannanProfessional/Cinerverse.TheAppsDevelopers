import React from 'react';
import { cn } from '@/utils';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-border bg-[#0f131d] px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
      className,
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
