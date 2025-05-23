"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ContactType = "hire" | "collaborate";

export interface ContactInfo {
  email: string;
  phone: string;
}

const CONTACT_INFO: Record<ContactType, ContactInfo> = {
  hire: {
    email: "msreddy2658@gmail.com",
    phone: "+13153672858"
  },
  collaborate: {
    email: "ms@eduflixai.com", 
    phone: "+14102452211"
  }
};

interface DynamicContactProps {
  className?: string;
  buttonText?: string;
  showPhone?: boolean;
}

export default function DynamicContact({ 
  className = "", 
  buttonText = "Contact Me",
  showPhone = true 
}: DynamicContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);

  const handleContactTypeSelect = (type: ContactType) => {
    setSelectedType(type);
  };

  const contactInfo = selectedType ? CONTACT_INFO[selectedType] : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 rounded-full text-sm bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors ${className}`}
      >
        {buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="glassmorphism max-w-md w-full p-6 rounded-xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedType(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {!selectedType ? (
                <div>
                  <h3 className="text-2xl font-bold mb-6">How would you like to connect?</h3>
                  <div className="space-y-4">
                    <motion.button
                      onClick={() => handleContactTypeSelect("hire")}
                      className="w-full p-4 rounded-lg bg-neon-cyan/10 text-left hover:bg-neon-cyan/20 transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center group-hover:bg-neon-cyan/30 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-neon-cyan">Looking to Hire Me</h4>
                          <p className="text-sm text-white/70">For freelance projects or full-time opportunities</p>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleContactTypeSelect("collaborate")}
                      className="w-full p-4 rounded-lg bg-neon-violet/10 text-left hover:bg-neon-violet/20 transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-neon-violet/20 flex items-center justify-center group-hover:bg-neon-violet/30 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-neon-violet">Collaboration & Investment</h4>
                          <p className="text-sm text-white/70">For partnerships, investments, or joint ventures</p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                  </button>

                  <h3 className="text-2xl font-bold mb-6">
                    {selectedType === "hire" ? "Ready to Hire Me?" : "Let's Collaborate!"}
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <label className="text-sm text-white/70 block mb-2">Email</label>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{contactInfo?.email}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(contactInfo?.email || "")}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy email"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24264C20 6.44699 19.6839 5.68393 19.1213 5.12132L16.8787 2.87868C16.3161 2.31607 15.553 2 14.7574 2H10C8.89543 2 8 2.89543 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V7C4 5.89543 4.89543 5 6 5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {showPhone && (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <label className="text-sm text-white/70 block mb-2">Phone</label>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium">{contactInfo?.phone}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(contactInfo?.phone || "")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copy phone number"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24264C20 6.44699 19.6839 5.68393 19.1213 5.12132L16.8787 2.87868C16.3161 2.31607 15.553 2 14.7574 2H10C8.89543 2 8 2.89543 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V7C4 5.89543 4.89543 5 6 5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <a
                        href={`mailto:${contactInfo?.email}`}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                          selectedType === "hire"
                            ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                            : "bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30"
                        }`}
                      >
                        Send Email
                      </a>
                      {showPhone && (
                        <a
                          href={`tel:${contactInfo?.phone}`}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                            selectedType === "hire"
                              ? "bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/30"
                              : "bg-neon-violet/10 text-neon-violet hover:bg-neon-violet/20 border border-neon-violet/30"
                          }`}
                        >
                          Call Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook to get contact info for a specific type
export function useContactInfo(type: ContactType): ContactInfo {
  return CONTACT_INFO[type];
}
