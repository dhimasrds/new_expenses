'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ChartVisualization() {
  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96">
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Background circles */}
          <motion.circle
            cx="300"
            cy="80"
            r="25"
            fill="#1d4ed8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.circle
            cx="350"
            cy="40"
            r="40"
            fill="#3730a3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <motion.circle
            cx="320"
            cy="200"
            r="20"
            fill="#2563eb"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.9 }}
          />

          {/* Chart bars */}
          <motion.rect
            x="50"
            y="150"
            width="40"
            height="100"
            fill="#1e293b"
            rx="4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="110"
            y="80"
            width="40"
            height="170"
            fill="#8b5cf6"
            rx="4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="170"
            y="120"
            width="40"
            height="130"
            fill="#3b82f6"
            rx="4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="230"
            y="100"
            width="40"
            height="150"
            fill="#1e293b"
            rx="4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="290"
            y="140"
            width="40"
            height="110"
            fill="#8b5cf6"
            rx="4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ transformOrigin: "bottom" }}
          />
        </svg>
        
        {/* Caption */}
        <motion.p 
          className="text-gray-400 text-sm text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          Illustrative financial data representation
        </motion.p>
      </motion.div>
    </div>
  );
}