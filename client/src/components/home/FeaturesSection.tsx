'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Shield, Smartphone } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Get detailed insights into your spending patterns with powerful analytics and visualizations.',
  },
  {
    icon: PieChart,
    title: 'Budget Management',
    description: 'Create and track budgets across different categories to stay on top of your finances.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and protected with bank-level security measures.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Access your expenses anywhere, anytime with our responsive web application.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything you need to manage your finances
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you take control of your money and build better financial habits.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}