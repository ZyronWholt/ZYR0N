"use client"

import { motion } from "framer-motion"

interface TurtleMascotProps {
  className?: string
  message?: string
}

export function TurtleMascot({ className = "", message }: TurtleMascotProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Caparazón */}
          <ellipse cx="100" cy="100" rx="70" ry="60" fill="#20B2AA" />
          <ellipse cx="100" cy="100" rx="55" ry="45" fill="#48D1CC" />
          <ellipse cx="100" cy="100" rx="40" ry="30" fill="#AFEEEE" />

          {/* Cabeza */}
          <circle cx="160" cy="100" r="25" fill="#48D1CC" />

          {/* Ojos kawaii */}
          <circle cx="170" cy="90" r="8" fill="white" />
          <circle cx="170" cy="90" r="4" fill="black" />
          <circle cx="172" cy="88" r="2" fill="white" />

          <circle cx="170" cy="110" r="8" fill="white" />
          <circle cx="170" cy="110" r="4" fill="black" />
          <circle cx="172" cy="108" r="2" fill="white" />

          {/* Mejillas kawaii */}
          <circle cx="180" cy="95" r="5" fill="#FFB6C1" opacity="0.6" />
          <circle cx="180" cy="105" r="5" fill="#FFB6C1" opacity="0.6" />

          {/* Sonrisa kawaii */}
          <path d="M175 100 Q180 107 175 110" stroke="black" fill="none" strokeWidth="2" />

          {/* Patas */}
          <ellipse cx="60" cy="50" rx="15" ry="10" fill="#48D1CC" />
          <ellipse cx="60" cy="150" rx="15" ry="10" fill="#48D1CC" />
          <ellipse cx="140" cy="50" rx="15" ry="10" fill="#48D1CC" />
          <ellipse cx="140" cy="150" rx="15" ry="10" fill="#48D1CC" />

          {/* Detalles kawaii */}
          <circle cx="85" cy="85" r="5" fill="#AFEEEE" />
          <circle cx="115" cy="85" r="5" fill="#AFEEEE" />
          <circle cx="85" cy="115" r="5" fill="#AFEEEE" />
          <circle cx="115" cy="115" r="5" fill="#AFEEEE" />
          <circle cx="100" cy="100" r="5" fill="#AFEEEE" />
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-md text-teal-800 text-sm max-w-[200px] z-10 border-2 border-teal-200"
        >
          <div className="relative">
            {message}
            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
