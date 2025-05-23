-- Collaborate Page Database Schema

-- Table for "Who I'm Looking For" section
CREATE TABLE collaborate_looking_for (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  icon_svg TEXT,
  description TEXT NOT NULL,
  color_theme VARCHAR(50) DEFAULT 'neon-cyan', -- neon-cyan, neon-violet, neon-lime
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for testimonials
CREATE TABLE collaborate_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_title VARCHAR(255),
  author_company VARCHAR(255),
  author_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for collaboration inquiries (form submissions)
CREATE TABLE collaborate_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type VARCHAR(50) NOT NULL CHECK (inquiry_type IN ('developer', 'investor')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255), -- for investors
  area_of_interest VARCHAR(255), -- for developers
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
  notes TEXT, -- admin notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for calendar/meeting settings
CREATE TABLE collaborate_calendar_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendly_url VARCHAR(500) NOT NULL,
  meeting_duration INTEGER DEFAULT 15, -- minutes
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_collaborate_looking_for_active ON collaborate_looking_for(is_active, sort_order);
CREATE INDEX idx_collaborate_testimonials_featured ON collaborate_testimonials(is_featured, is_active, sort_order);
CREATE INDEX idx_collaborate_inquiries_type_status ON collaborate_inquiries(inquiry_type, status, created_at);
CREATE INDEX idx_collaborate_inquiries_email ON collaborate_inquiries(email);

-- Insert default data
INSERT INTO collaborate_looking_for (title, description, color_theme, sort_order) VALUES 
('SWE who loves fixing systems', 'Engineers who see broken processes as opportunities, not annoyances. People who build because they must.', 'neon-cyan', 1),
('AI/NLP enthusiast', 'People who understand that AI isn''t just about following trends, but building utilities that actually make life better.', 'neon-violet', 2),
('Product-led backend devs', 'Backend developers who understand user experience and can build APIs with the product vision in mind.', 'neon-lime', 3);

INSERT INTO collaborate_testimonials (quote, author_name, author_title, author_company, is_featured) VALUES 
('Sashreek moves fast and thinks deeply. In just one week, he went from concept to working prototype while managing all the technical challenges. His ability to balance visionary thinking with hands-on execution is rare.', 'Ramana Murthy', 'CTO', 'EnterpriseAI', true);

INSERT INTO collaborate_calendar_settings (calendly_url, description) VALUES 
('https://calendly.com/yourusername/15min', 'Book a 15-min chat');
