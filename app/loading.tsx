// app/loading.tsx
"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#020617] flex items-center justify-center">
      {/* Background premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.10),_transparent_35%),linear-gradient(to_bottom,_#020617,_#0A1428,_#020617)]" />

      {/* Glow central */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />

      <div className="relative flex flex-col items-center">
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative"
        >
          {/* Cercle externe */}
          <div className="w-28 h-28 rounded-full border-4 border-white/10 border-t-emerald-400 animate-spin" />

          {/* Cercle interne */}
          <div className="absolute inset-3 rounded-full border border-emerald-400/30" />

          {/* Badge EC */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(16,185,129,0.4)",
                  "0 0 35px rgba(16,185,129,0.8)",
                  "0 0 0px rgba(16,185,129,0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
            >
              EC
            </motion.div>
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Essor Crédit
          </h1>

          <p className="text-emerald-300 text-sm tracking-[0.35em] uppercase mt-3">
            Banque Privée Digitale
          </p>

          <p className="text-zinc-400 mt-4 text-sm">
            Préparation de votre expérience premium...
          </p>
        </motion.div>

        {/* Barre de chargement */}
        <div className="mt-10 w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}