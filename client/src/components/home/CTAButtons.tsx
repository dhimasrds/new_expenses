'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTAButtons() {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Link href="/signup" className="w-full sm:w-auto">
        <Button 
          size="lg" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Sign Up for Free
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      <Link href="/login" className="w-full sm:w-auto">
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-200 hover:scale-105"
        >
          Login
        </Button>
      </Link>
    </motion.div>
  );
}