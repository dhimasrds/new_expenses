'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/home/HeroSection';

export default function LandingPage() {
  return (
    <motion.div 
      className="min-h-screen bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <HeroSection />
    </motion.div>
  );
}