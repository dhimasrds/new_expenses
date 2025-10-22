'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CTAButtons } from './CTAButtons';

export function HeroContent() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Take Control of Your{' '}
          <span className="text-blue-400">Finances</span>,{' '}
          <br className="hidden sm:block" />
          <span className="text-white">Effortlessly.</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed">
          ExpenseTracker helps you monitor spending, create budgets, and achieve 
          your financial goals with intuitive tools and insightful reports.
        </p>
      </motion.div>

      <CTAButtons />
    </div>
  );
}