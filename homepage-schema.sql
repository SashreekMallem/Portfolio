-- Homepage Content Database Schema

-- Main homepage content table
CREATE TABLE homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Hero Section
  hero_headline VARCHAR(255) NOT NULL DEFAULT 'I build useful things',
  hero_highlight_word VARCHAR(100) NOT NULL DEFAULT 'useful',
  hero_intro_text TEXT NOT NULL DEFAULT 'Hi, I''m Sashreek Mallem. I build AI-powered startups that solve real-world problems. Currently working on FairHire, a platform that eliminates bias in hiring.',
  hero_primary_cta_text VARCHAR(100) NOT NULL DEFAULT 'See My Projects',
  hero_primary_cta_url VARCHAR(255) NOT NULL DEFAULT '/projects',
  hero_secondary_cta_text VARCHAR(100) NOT NULL DEFAULT 'Let''s Collaborate',
  hero_secondary_cta_url VARCHAR(255) NOT NULL DEFAULT '/collaborate',
  hero_scroll_text VARCHAR(100) NOT NULL DEFAULT 'Scroll to explore',
  
  -- Why I Build Section
  why_build_headline VARCHAR(255) NOT NULL DEFAULT 'Why I Build',
  why_build_intro TEXT NOT NULL DEFAULT 'I believe in building products that meaningfully improve people''s lives. Not just clever technical solutions, but tools that solve real problems.',
  why_build_quote TEXT NOT NULL DEFAULT 'I''m not interested in building just another AI startup. I''m obsessed with finding broken systems and fixing them in a way that makes people say, ''Why wasn''t this always done this way?''',
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  twitter_url VARCHAR(500),
  
  -- Meta
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Building principles table (for the "Why I Build" section)
CREATE TABLE homepage_building_principles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100) NOT NULL, -- SVG icon filename without extension
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Homepage stats table (for storing project statistics or custom text)
CREATE TABLE homepage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_count INTEGER DEFAULT 0,
  mvp_count INTEGER DEFAULT 0,
  live_count INTEGER DEFAULT 0,
  custom_stats_text TEXT,
  use_custom_text BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_homepage_content_active ON homepage_content(is_active);
CREATE INDEX idx_building_principles_active ON homepage_building_principles(is_active, sort_order);

-- Insert default homepage content
INSERT INTO homepage_content (
  hero_headline,
  hero_highlight_word,
  hero_intro_text,
  hero_primary_cta_text,
  hero_primary_cta_url,
  hero_secondary_cta_text,
  hero_secondary_cta_url,
  hero_scroll_text,
  why_build_headline,
  why_build_intro,
  why_build_quote,
  email,
  location,
  linkedin_url,
  github_url
) VALUES (
  'I build useful things',
  'useful',
  'Hi, I''m Sashreek Mallem. I build AI-powered startups that solve real-world problems. Currently working on FairHire, a platform that eliminates bias in hiring.',
  'See My Projects',
  '/projects',
  'Let''s Collaborate',
  '/collaborate',
  'Scroll to explore',
  'Why I Build',
  'I believe in building products that meaningfully improve people''s lives. Not just clever technical solutions, but tools that solve real problems.',
  'I''m not interested in building just another AI startup. I''m obsessed with finding broken systems and fixing them in a way that makes people say, ''Why wasn''t this always done this way?''',
  'hello@sashreekmallem.com',
  'San Francisco, CA',
  'https://linkedin.com/in/sashreekmallem',
  'https://github.com/sashreekmallem'
);

-- Insert default building principles
INSERT INTO homepage_building_principles (title, description, icon_name, sort_order) VALUES 
('Solve Real Problems', 'I only build products that address genuine pain points, not solutions looking for problems.', 'file', 1),
('AI with Purpose', 'I use AI to augment human capabilities, not replace them. Technology should empower, not diminish.', 'globe', 2),
('Fast Execution', 'From idea to MVP in weeks, not months. I iterate quickly based on real user feedback.', 'window', 3);

-- Insert default stats
INSERT INTO homepage_stats (project_count, mvp_count, live_count, custom_stats_text, use_custom_text)
VALUES (7, 3, 2, '7 Projects • 3 MVPs • 2 Live Products', false);
