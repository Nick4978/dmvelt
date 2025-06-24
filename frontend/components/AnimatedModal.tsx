'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedModal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Open Modal
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow-lg w-96 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-2">Animated Modal</h2>
              <p className="text-sm text-gray-600 mb-4">This modal animates in and out using Framer Motion.</p>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
