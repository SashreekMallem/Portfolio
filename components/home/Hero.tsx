"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticlesBackground from "./ParticlesBackground";
import { HomepageContent } from "@/lib/supabase";
import DynamicContact from "@/components/ui/DynamicContact";

export default function Hero() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [projectStats, setProjectStats] = useState<string>("7 Projects • 3 MVPs • 2 Live Products");

  useEffect(() => {
    fetchContent();
    fetchProjectStats();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/homepage/content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    }
  };

  const fetchProjectStats = async () => {
    try {
      const response = await fetch('/api/projects/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.statsString) {
          setProjectStats(data.statsString);
        }
      }
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  // Use default content if none loaded yet
  const displayContent = content || {
    hero_headline: "I build useful things",
    hero_highlight_word: "useful", 
    hero_intro_text: "Hi, I'm Sashreek Mallem. I build AI-powered startups that solve real-world problems. Currently working on FairHire, a platform that eliminates bias in hiring.",
    hero_primary_cta_text: "See My Projects",
    hero_primary_cta_url: "/projects",
    hero_secondary_cta_text: "Let's Collaborate", 
    hero_secondary_cta_url: "/collaborate",
    hero_scroll_text: "Scroll to explore"
  };

  const renderHeadline = () => {
    const headline = displayContent.hero_headline;
    const highlightWord = displayContent.hero_highlight_word;
    
    if (headline.includes(highlightWord)) {
      const parts = headline.split(highlightWord);
      return (
        <>
          {parts[0]}<span className="text-neon-cyan">{highlightWord}</span>{parts[1]}
        </>
      );
    }
    
    return headline;
  };

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
              {renderHeadline()}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              {displayContent.hero_intro_text}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href={displayContent.hero_primary_cta_url}
                className="px-6 py-3 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg hover:bg-neon-cyan/20 transition-all"
              >
                {displayContent.hero_primary_cta_text}
              </Link>
              <Link 
                href={displayContent.hero_secondary_cta_url}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                {displayContent.hero_secondary_cta_text}
              </Link>
              <DynamicContact 
                className="px-6 py-3 bg-neon-violet/10 text-neon-violet border border-neon-violet/20 hover:bg-neon-violet/20"
                buttonText="Contact Me"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-12 h-[2px] bg-white/20"></div>
            <div className="text-sm text-white/50">{projectStats}</div>
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
        <span className="text-white/50 text-sm">{displayContent.hero_scroll_text}</span>
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