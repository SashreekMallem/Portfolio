"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HomepageContent, HomepageBuildingPrinciple } from "@/lib/supabase";

export default function WhyIBuild() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [principles, setPrinciples] = useState<HomepageBuildingPrinciple[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [contentRes, principlesRes] = await Promise.all([
        fetch('/api/homepage/content'),
        fetch('/api/homepage/building-principles')
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }

      if (principlesRes.ok) {
        const principlesData = await principlesRes.json();
        setPrinciples(principlesData);
      }
    } catch (error) {
      console.error('Error fetching why build content:', error);
    }
  };

  // Default content if not loaded yet
  const displayContent = content || {
    why_build_headline: "Why I Build",
    why_build_intro: "I believe in building products that meaningfully improve people's lives. Not just clever technical solutions, but tools that solve real problems.",
    why_build_quote: "I'm not interested in building just another AI startup. I'm obsessed with finding broken systems and fixing them in a way that makes people say, 'Why wasn't this always done this way?'"
  };

  const displayPrinciples = principles.length > 0 ? principles : [
    {
      id: "1",
      title: "Solve Real Problems",
      description: "I only build products that address genuine pain points, not solutions looking for problems.",
      icon_name: "file",
      sort_order: 1,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    {
      id: "2", 
      title: "AI with Purpose",
      description: "I use AI to augment human capabilities, not replace them. Technology should empower, not diminish.",
      icon_name: "globe",
      sort_order: 2,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      title: "Fast Execution", 
      description: "From idea to MVP in weeks, not months. I iterate quickly based on real user feedback.",
      icon_name: "window",
      sort_order: 3,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
  ];
  
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{displayContent.why_build_headline}</h2>
          <p className="text-xl text-white/80">
            {displayContent.why_build_intro}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPrinciples.map((principle, index) => (
            <motion.div 
              key={principle.id}
              className="glassmorphism p-8 rounded-xl flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mb-6 relative">
                <Image 
                  src={`/${principle.icon_name}.svg`}
                  alt={principle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 64px"
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
              <p className="text-white/70">{principle.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="max-w-3xl mx-auto mt-16 glassmorphism p-8 md:p-10 rounded-xl relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute -top-3 -left-3 text-4xl">❝</div>
          <div className="absolute -bottom-3 -right-3 text-4xl">❞</div>
          
          <p className="text-lg md:text-xl text-center italic text-white/90">
            {displayContent.why_build_quote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}