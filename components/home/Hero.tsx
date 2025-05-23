"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParticlesBackground from "./ParticlesBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Particles background */}
      <ParticlesBackground />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              I build <span className="text-neon-cyan">useful</span> things
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Hi, I'm Sashreek Mallem. I build AI-powered startups that solve real-world problems. 
              Currently working on FairHire, a platform that eliminates bias in hiring.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/projects"
                className="px-6 py-3 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg hover:bg-neon-cyan/20 transition-all"
              >
                See My Projects
              </Link>
              <Link 
                href="/collaborate"
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                Let's Collaborate
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-12 h-[2px] bg-white/20"></div>
            <div className="text-sm text-white/50">7 Projects • 3 MVPs • 2 Live Products</div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <span className="text-white/50 text-sm">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Floating tech logos (optional for future enhancement) */}
    </section>
  );
}