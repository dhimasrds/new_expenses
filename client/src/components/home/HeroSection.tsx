'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from './HeroContent';
import { ChartVisualization } from './ChartVisualization';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="order-2 lg:order-1">
            <HeroContent />
          </div>
          <div className="order-1 lg:order-2">
            <ChartVisualization />
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
}