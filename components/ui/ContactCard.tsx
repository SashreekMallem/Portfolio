"use client";

import DynamicContact from "./DynamicContact";

interface ContactCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function ContactCard({ 
  title = "Interested in This Project?",
  description = "Let's discuss how we can work together on similar projects or explore collaboration opportunities.",
  className = ""
}: ContactCardProps) {
  return (
    <div className={`glassmorphism p-6 rounded-xl ${className}`}>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/70 mb-6">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <DynamicContact 
          className="flex-1 justify-center text-center"
          buttonText="Contact Me"
        />
        <a
          href="/collaborate"
          className="flex-1 py-2 px-4 rounded-full text-sm bg-neon-violet/10 text-neon-violet hover:bg-neon-violet/20 transition-colors text-center"
        >
          View Collaborate Page
        </a>
      </div>
    </div>
  );
}
