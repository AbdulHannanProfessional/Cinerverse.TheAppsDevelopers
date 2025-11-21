import React from 'react';
import { cn } from '@/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const styles = {
    default:
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-white/10 text-white',
    outline:
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border border-border text-muted',
    success:
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-green-500/15 text-green-300',
    warning:
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-yellow-500/15 text-yellow-200',
    danger:
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-red-500/15 text-red-200',
  };

  return <span className={cn(styles[variant] || styles.default, className)} {...props} />;
}
