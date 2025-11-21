import React from 'react';
import { cn } from '@/utils';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => onOpenChange?.(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function DialogContent({ className, ...props }) {
  return (
    <div
      className={cn(
        'w-full max-w-lg rounded-2xl border border-border bg-[#0f131d] p-6 shadow-2xl shadow-black/40',
        className,
      )}
      {...props}
    />
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('mb-4 space-y-1', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h3 className={cn('text-xl font-semibold text-white', className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}

