"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/ui/Navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

// Timeline data type definition
type TimelineItem = {
  id: number;
  date: string;
  month: string;
  year: string;
  title: string;
  description: string;
  details: string;
  icon: string;
  type: 'education' | 'project' | 'work' | 'achievement';
};

type Skill = {
  id: number;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
};

type Profile = {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  resume_url: string | null;
  hidden_message: string;
  socialLinks: SocialLink[];
};

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

// Initial data for fallback
const initialTimelineItems: TimelineItem[] = [];

export default function AboutPage() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(initialTimelineItems);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<{[key: string]: Skill[]}>({}); 
  
  // Function to fetch timeline data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch timeline data
        const timelineResponse = await fetch('/api/about/timeline');
        const timelineData = await timelineResponse.json();
        setTimelineItems(timelineData);
        
        // Fetch profile data
        const profileResponse = await fetch('/api/about/profile');
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Fetch skills data
        const skillsResponse = await fetch('/api/about/skills');
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching about page data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to toggle expanded item
  const toggleExpand = (id: number) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  // Function to render social icons
  const renderSocialIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.9 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 0z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-2-12c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm6 0c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm-2.872 5.428c-1.077.957-2.777.957-3.815.02l-.141-.125c-.258-.238-.676-.238-.934 0-.258.238-.258.625 0 .863.397.357.866.636 1.378.836.999.39 2.122.387 3.122-.01.517-.202.981-.487 1.373-.851.258-.238.258-.625 0-.863-.26-.238-.676-.238-.934.02l-.049.05z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Me
            </motion.h1>
            
            {/* Profile */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
              </div>
            ) : profile ? (
              <motion.div 
                className="flex flex-col md:flex-row gap-8 items-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-48 h-48 relative rounded-full overflow-hidden glassmorphism p-1">
                  <div className="bg-gray-800 w-full h-full rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <Image 
                        src={profile.avatar_url} 
                        alt={profile.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-6xl">👨‍💻</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">{profile.name}</h2>
                  <p className="text-xl text-white/80 mb-4">{profile.title}</p>
                  <p className="text-white/70 mb-6">{profile.bio}</p>
                  <div className="flex flex-wrap gap-4">
                    {profile.socialLinks && profile.socialLinks.map((link) => (
                      <a 
                        key={link.id}
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                      >
                        {renderSocialIcon(link.platform)}
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p>Failed to load profile information.</p>
              </div>
            )}
            
            {/* Timeline */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-12 text-center">My Journey</h2>
              <div className="relative">
                {/* Loading state */}
                {isLoading && (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
                  </div>
                )}
                
                {!isLoading && timelineItems.length === 0 && (
                  <div className="text-center py-12">
                    <p>No timeline data available.</p>
                  </div>
                )}
                
                {!isLoading && timelineItems.length > 0 && (
                  <>
                    {/* Vertical Line - centered and properly extending through all items */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-neon-cyan via-neon-violet to-transparent"></div>
                    
                    {/* Timeline Items */}
                    <div className="space-y-32">
                      {timelineItems.map((item, index) => (
                        <motion.div 
                          key={item.id}
                          className="relative pt-16" // Added top padding to create more space
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {/* Date marker - positioned higher above the content */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-neon-cyan/10 text-neon-cyan px-4 py-1 rounded-full text-sm whitespace-nowrap z-20">
                            {item.date}
                          </div>
                          
                          {/* Icon - positioned with more space from the date */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-12 h-12 rounded-full glassmorphism flex items-center justify-center z-10">
                            <span className="text-xl">{item.icon}</span>
                          </div>
                          
                          {/* Content - alternating sides with proper spacing and no overlaps */}
                          <div 
                            className={`w-5/12 glassmorphism p-5 rounded-xl ${
                              index % 2 === 0 
                                ? "ml-0 mr-auto pr-6 text-right" // Left side
                                : "mr-0 ml-auto pl-6" // Right side
                            }`}
                          >
                            {/* Tag based on type */}
                            <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${
                              item.type === 'education' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : item.type === 'project' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : item.type === 'work' 
                                    ? 'bg-amber-500/20 text-amber-300' 
                                    : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </div>
                            
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-white/70 mb-3">{item.description}</p>
                            
                            {/* Expandable content */}
                            <button 
                              onClick={() => toggleExpand(item.id)}
                              className={`flex items-center gap-1 text-sm text-neon-cyan hover:text-white transition-colors ${
                                index % 2 === 0 ? "ml-auto" : "" // Align button right for left-side content
                              }`}
                            >
                              {expandedItem === item.id ? 'Show less' : 'Show more'}
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                className={`transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`}
                              >
                                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            
                            {/* Expanded details */}
                            {expandedItem === item.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 border-t border-white/10 pt-4"
                              >
                                <p className={`text-white/70 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                                  {item.details}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Skills */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Skills & Expertise</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
                </div>
              ) : Object.keys(skills).length > 0 ? (
                <div className="glassmorphism p-8 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(skills).map(([category, categorySkills], index) => (
                      <div key={index} className="text-center p-4">
                        <div className="text-3xl mb-3">
                          {categorySkills[0]?.icon || '💻'}
                        </div>
                        <h3 className="font-bold mb-2">{category}</h3>
                        <p className="text-sm text-white/70">
                          {categorySkills.map(skill => skill.name).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>No skills data available.</p>
                </div>
              )}
            </motion.div>
            
            {/* Hidden Nugget */}
            {profile?.hidden_message && (
              <motion.div 
                className="text-center text-white/30 text-sm italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                "{profile.hidden_message}"
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}