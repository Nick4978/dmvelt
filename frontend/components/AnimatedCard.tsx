'use client';
import { motion } from 'framer-motion';

export default function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold mb-2">Lien Summary</h3>
      <p className="text-gray-600 text-sm">This card slides in with a fade when it renders.</p>
    </motion.div>
  );
}
