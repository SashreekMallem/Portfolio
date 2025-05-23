"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { useState } from "react";

// Mock data for open roles
const openRoles = [
  {
    project: "FairHire",
    role: "Backend Dev",
    focus: "GPT Skill Verifier",
    description: "Looking for a backend developer with experience in Python and GPT integration to improve our skill verification algorithm."
  },
  {
    project: "EduFlix",
    role: "AI Engineer",
    focus: "Recommendation Engine",
    description: "Need an AI/ML specialist to build a Netflix-style recommendation engine for educational content based on learning patterns."
  },
  {
    project: "SplitFair",
    role: "Full Stack Dev",
    focus: "Payment Integration",
    description: "Seeking a full stack developer to implement secure payment processing and expense tracking features."
  }
];

// Mock data for GitHub issues
const openIssues = [
  {
    title: "Implement OAuth login flow",
    project: "FairHire",
    difficulty: "medium",
    url: "https://github.com/yourusername/fairhire/issues/42"
  },
  {
    title: "Fix mobile responsiveness in dashboard",
    project: "SplitFair",
    difficulty: "easy",
    url: "https://github.com/yourusername/splitfair/issues/15"
  },
  {
    title: "Optimize video streaming performance",
    project: "EduFlix",
    difficulty: "hard",
    url: "https://github.com/yourusername/eduflix/issues/23"
  }
];

export default function CollaboratePage() {
  const [activeForm, setActiveForm] = useState<"developer" | "investor" | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would connect to your Supabase table
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Let's Collaborate</h1>
            <p className="text-xl text-white/80 text-center mb-8">
              I'm always looking for talented people who want to build useful products that solve real problems.
            </p>
          </motion.div>
          
          {/* Who I'm looking for */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Who I'm Looking For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glassmorphism p-6 rounded-xl">
                <div className="bg-neon-cyan/10 w-12 h-12 rounded-full flex items-center justify-center text-neon-cyan mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">SWE who loves fixing systems</h3>
                <p className="text-white/70">
                  Engineers who see broken processes as opportunities, not annoyances. People who build because they must.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl">
                <div className="bg-neon-violet/10 w-12 h-12 rounded-full flex items-center justify-center text-neon-violet mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5V7.5M12 7.5C13.6569 7.5 15 8.84315 15 10.5C15 12.1569 13.6569 13.5 12 13.5M12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5M12 13.5V16.5M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">AI/NLP enthusiast</h3>
                <p className="text-white/70">
                  People who understand that AI isn't just about following trends, but building utilities that actually make life better.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl">
                <div className="bg-neon-lime/10 w-12 h-12 rounded-full flex items-center justify-center text-neon-lime mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 2H8.6C8.2 2 8 2.2 8 2.6V5H12.5C13.9 5 15 6.1 15 7.5V15C15 15.4 15.2 15.6 15.6 15.6H18C19.1 15.6 20 14.7 20 13.6V6.5L15.5 2Z" fill="currentColor"/>
                    <path d="M13 7.5C13 7.2 12.8 7 12.5 7H7.5C7.2 7 7 7.2 7 7.5V18.5C7 18.8 7.2 19 7.5 19H12.5C12.8 19 13 18.8 13 18.5V7.5Z" fill="currentColor"/>
                    <path d="M7 5V2.6C7 1.7 6.3 1 5.4 1H4.6C3.7 1 3 1.7 3 2.6V5H7Z" fill="currentColor"/>
                    <path d="M4.4 20H11.6C12.4 20 13 19.4 13 18.6V7.4C13 6.6 12.4 6 11.6 6H4.4C3.6 6 3 6.6 3 7.4V18.6C3 19.4 3.6 20 4.4 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Product-led backend devs</h3>
                <p className="text-white/70">
                  Backend developers who understand user experience and can build APIs with the product vision in mind.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Open Roles */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Current Roles Available</h2>
            <div className="glassmorphism p-8 rounded-xl">
              <div className="space-y-6">
                {openRoles.map((role, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-neon-cyan font-semibold">{role.project}</span>
                        <span className="text-xs text-white/50">•</span>
                        <span>{role.role}</span>
                      </div>
                      <h3 className="font-bold mb-1">{role.focus}</h3>
                      <p className="text-sm text-white/70">{role.description}</p>
                    </div>
                    <button 
                      onClick={() => setActiveForm("developer")}
                      className="px-4 py-2 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Testimonial */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glassmorphism p-8 rounded-xl relative">
              <div className="text-5xl absolute -top-5 left-6 opacity-50">"</div>
              <div className="relative z-10">
                <p className="text-lg md:text-xl text-white/80 mb-6">
                  Sashreek moves fast and thinks deeply. In just one week, he went from concept to working prototype while managing all the technical challenges. His ability to balance visionary thinking with hands-on execution is rare.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div>
                    <h3 className="font-bold">Ramana Murthy</h3>
                    <p className="text-sm text-white/60">CTO, EnterpriseAI</p>
                  </div>
                </div>
              </div>
              <div className="text-5xl absolute -bottom-10 right-6 opacity-50">"</div>
            </div>
          </motion.div>
          
          {/* GitHub Issues */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Open Issues from GitHub</h2>
            <div className="glassmorphism p-6 rounded-xl">
              <div className="space-y-3">
                {openIssues.map((issue, index) => (
                  <a 
                    key={index}
                    href={issue.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <div className="font-medium">{issue.title}</div>
                        <div className="text-sm text-white/60">{issue.project}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      issue.difficulty === "easy" 
                        ? "bg-green-500/20 text-green-400" 
                        : issue.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}>
                      {issue.difficulty}
                    </span>
                  </a>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a 
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-neon-cyan hover:underline"
                >
                  <span>View all open issues</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Call to action */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 glassmorphism p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">For Developers</h3>
                <p className="text-white/70 mb-6">
                  Interested in joining one of the projects? Let's talk about how we can collaborate.
                </p>
                <button 
                  onClick={() => setActiveForm("developer")}
                  className="w-full py-3 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors"
                >
                  Connect as a Developer
                </button>
              </div>
              
              <div className="flex-1 glassmorphism p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">For Investors</h3>
                <p className="text-white/70 mb-6">
                  Looking for early-stage investment opportunities? Get access to pitch decks.
                </p>
                <button 
                  onClick={() => setActiveForm("investor")}
                  className="w-full py-3 bg-neon-violet/10 text-neon-violet rounded-lg hover:bg-neon-violet/20 transition-colors"
                >
                  Connect as an Investor
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form - Conditionally rendered */}
          {activeForm && !isSubmitted && (
            <motion.div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glassmorphism max-w-lg w-full p-6 rounded-xl relative">
                <button 
                  onClick={() => setActiveForm(null)} 
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <h3 className="text-2xl font-bold mb-6">
                  {activeForm === "developer" ? "Connect as a Developer" : "Connect as an Investor"}
                </h3>
                
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        required
                      />
                    </div>
                    
                    {activeForm === "developer" && (
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-1">Role you're interested in</label>
                        <select 
                          id="role" 
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                          required
                        >
                          <option value="">Select a role</option>
                          {openRoles.map((role, index) => (
                            <option key={index} value={`${role.project} - ${role.role}`}>
                              {role.project} - {role.role}
                            </option>
                          ))}
                          <option value="other">Something else</option>
                        </select>
                      </div>
                    )}
                    
                    {activeForm === "investor" && (
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-1">Company / Fund</label>
                        <input 
                          type="text" 
                          id="company" 
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={4}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        placeholder="Tell me a bit about yourself and what you're looking for..."
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className={`w-full py-3 rounded-lg font-medium ${
                        activeForm === "developer"
                          ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                          : "bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30"
                      } transition-colors`}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
          
          {/* Success Message */}
          {isSubmitted && (
            <motion.div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glassmorphism max-w-md w-full p-8 rounded-xl text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
                <p className="text-white/70 mb-6">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setActiveForm(null);
                  }} 
                  className="px-6 py-3 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Calendar Link */}
          <div className="text-center mb-4">
            <p className="text-white/70 mb-2">Prefer a direct conversation?</p>
            <a 
              href="https://calendly.com/yourusername/15min"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-neon-violet"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 18.8856 21 19.8284 20.4142 20.4142C19.8284 21 18.8856 21 17 21H7C5.11438 21 4.17157 21 3.58579 20.4142C3 19.8284 3 18.8856 3 17V8.5C3 6.61438 3 5.67157 3.58579 5.08579C4.17157 4.5 5.11438 4.5 7 4.5H17C18.8856 4.5 19.8284 4.5 20.4142 5.08579C21 5.67157 21 6.61438 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15Z" fill="currentColor"/>
                <path d="M17 15C17.5523 15 18 14.5523 18 14C18 13.4477 17.5523 13 17 13C16.4477 13 16 13.4477 16 14C16 14.5523 16.4477 15 17 15Z" fill="currentColor"/>
                <path d="M7 15C7.55228 15 8 14.5523 8 14C8 13.4477 7.55228 13 7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15Z" fill="currentColor"/>
                <path d="M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z" fill="currentColor"/>
                <path d="M17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18Z" fill="currentColor"/>
                <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="currentColor"/>
              </svg>
              <span>Book a 15-min chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}