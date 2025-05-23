"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { useState, useEffect } from "react";



type LookingForItem = {
  id: string;
  title: string;
  description: string;
  color_theme: 'neon-cyan' | 'neon-violet' | 'neon-lime';
};

type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_title: string | null;
  author_company: string | null;
  author_image_url: string | null;
};

type CalendarSettings = {
  calendly_url: string;
  description: string | null;
};

export default function CollaboratePage() {
  const [activeForm, setActiveForm] = useState<"developer" | "investor" | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lookingForItems, setLookingForItems] = useState<LookingForItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollaborateData();
  }, []);

  const fetchCollaborateData = async () => {
    try {
      const response = await fetch('/api/collaborate');
      if (response.ok) {
        const data = await response.json();
        setLookingForItems(data.lookingFor || []);
        setTestimonials(data.testimonials || []);
        setCalendarSettings(data.calendarSettings);
      }
    } catch (error) {
      console.error('Error fetching collaborate data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      inquiry_type: activeForm,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      area_of_interest: formData.get('interest') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/collaborate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="glassmorphism p-6 rounded-xl animate-pulse">
                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-16 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lookingForItems.map((item, index) => (
                  <div key={item.id} className="glassmorphism p-6 rounded-xl">
                    <div className={`bg-${item.color_theme}/10 w-12 h-12 rounded-full flex items-center justify-center text-${item.color_theme} mb-4`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          

          
          {/* Testimonials */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">What People Say</h2>
            {loading ? (
              <div className="glassmorphism p-8 rounded-xl animate-pulse">
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ) : testimonials.length > 0 ? (
              testimonials.filter(t => t.author_name).map((testimonial, index) => (
                <div key={testimonial.id} className="glassmorphism p-8 rounded-xl relative mb-8">
                  <div className="text-5xl absolute -top-5 left-6 opacity-50">"</div>
                  <div className="relative z-10">
                    <p className="text-lg md:text-xl text-white/80 mb-6">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4">
                      {testimonial.author_image_url ? (
                        <img 
                          src={testimonial.author_image_url} 
                          alt={testimonial.author_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                      )}
                      <div>
                        <h3 className="font-bold">{testimonial.author_name}</h3>
                        <p className="text-sm text-white/60">
                          {testimonial.author_title}
                          {testimonial.author_company && `, ${testimonial.author_company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl absolute -bottom-10 right-6 opacity-50">"</div>
                </div>
              ))
            ) : (
              <div className="glassmorphism p-8 rounded-xl text-center">
                <p className="text-white/60">
                  Testimonials coming soon. Be the first to work with me and share your experience!
                </p>
              </div>
            )}
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
                        name="name"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        required
                      />
                    </div>
                    
                    {activeForm === "developer" && (
                      <div>
                        <label htmlFor="interest" className="block text-sm font-medium mb-1">Area of Interest</label>
                        <input 
                          type="text" 
                          id="interest" 
                          name="interest"
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                          placeholder="e.g., Backend Development, AI/ML, Full Stack, etc."
                          required
                        />
                      </div>
                    )}
                    
                    {activeForm === "investor" && (
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-1">Company / Fund</label>
                        <input 
                          type="text" 
                          id="company" 
                          name="company"
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        name="message"
                        rows={4}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        placeholder="Tell me a bit about yourself and what you're looking for..."
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium ${
                        activeForm === "developer"
                          ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                          : "bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30"
                      } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
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
          {!loading && calendarSettings && (
            <div className="text-center mb-4">
              <p className="text-white/70 mb-2">Prefer a direct conversation?</p>
              <a 
                href={calendarSettings.calendly_url}
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
                <span>{calendarSettings.description || "Book a chat"}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}