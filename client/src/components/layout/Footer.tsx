'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <motion.footer 
      className="bg-slate-900 border-t border-slate-700/50 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
            <p className="text-gray-400 mt-2 max-w-md">
              Take control of your finances with our intuitive expense tracking platform.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 ExpenseTracker. Made with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}