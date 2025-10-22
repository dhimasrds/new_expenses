import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">ET</span>
      </div>
      <span className="font-semibold text-white text-lg">ExpenseTracker</span>
    </div>
  );
}