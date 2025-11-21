import React from 'react';
import { cn } from '@/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gradient-to-r from-[#1A1F2E] to-[#131720]', className)}
      {...props}
    />
  );
}
