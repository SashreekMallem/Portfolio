"use client";

import { useState, useEffect } from 'react';
import { HomepageContent, HomepageBuildingPrinciple } from '@/lib/supabase';

export default function HomepageAdmin() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [principles, setPrinciples] = useState<HomepageBuildingPrinciple[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'why-build' | 'principles' | 'contact' | 'stats'>('hero');
  const [statsData, setStatsData] = useState({
    project_count: 7,
    mvp_count: 3,
    live_count: 2,
    custom_stats_text: '7 Projects • 3 MVPs • 2 Live Products',
    use_custom_text: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentRes, principlesRes, statsRes] = await Promise.all([
        fetch('/api/homepage/content'),
        fetch('/api/homepage/building-principles'),
        fetch('/api/homepage/stats')
      ]);

      const contentData = await contentRes.json();
      const principlesData = await principlesRes.json();
      const stats = await statsRes.json();

      setContent(contentData);
      setPrinciples(principlesData);
      
      if (stats && !stats.error) {
        setStatsData({
          project_count: stats.total || stats.project_count || 0,
          mvp_count: stats.mvp || stats.mvp_count || 0,
          live_count: stats.live || stats.live_count || 0,
          custom_stats_text: stats.custom_stats_text || stats.stats || '',
          use_custom_text: stats.isCustom || stats.use_custom_text || false
        });
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/homepage/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        alert('Content saved successfully!');
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const savePrinciple = async (principle: HomepageBuildingPrinciple) => {
    try {
      const response = await fetch('/api/homepage/building-principles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(principle),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Principle saved successfully!');
      } else {
        throw new Error('Failed to save principle');
      }
    } catch (error) {
      console.error('Error saving principle:', error);
      alert('Error saving principle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading homepage content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Homepage Management</h1>
            <p className="text-white/60">Edit homepage content, hero section, and building principles</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving || !content}
            className="px-6 py-2 bg-neon-cyan text-dark-900 rounded-lg hover:bg-neon-cyan/90 disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { key: 'hero', label: 'Hero Section' },
            { key: 'why-build', label: 'Why I Build' },
            { key: 'principles', label: 'Building Principles' },
            { key: 'contact', label: 'Contact Info' },
            { key: 'stats', label: 'Stats' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-neon-cyan text-dark-900'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {content && (
          <div className="glassmorphism p-8 rounded-xl">
            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Headline</label>
                    <input
                      type="text"
                      value={content.hero_headline}
                      onChange={(e) => setContent({ ...content, hero_headline: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Highlighted Word</label>
                    <input
                      type="text"
                      value={content.hero_highlight_word}
                      onChange={(e) => setContent({ ...content, hero_highlight_word: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Intro Text</label>
                  <textarea
                    value={content.hero_intro_text}
                    onChange={(e) => setContent({ ...content, hero_intro_text: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Primary CTA Text</label>
                    <input
                      type="text"
                      value={content.hero_primary_cta_text}
                      onChange={(e) => setContent({ ...content, hero_primary_cta_text: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Primary CTA URL</label>
                    <input
                      type="text"
                      value={content.hero_primary_cta_url}
                      onChange={(e) => setContent({ ...content, hero_primary_cta_url: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={content.hero_secondary_cta_text}
                      onChange={(e) => setContent({ ...content, hero_secondary_cta_text: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Secondary CTA URL</label>
                    <input
                      type="text"
                      value={content.hero_secondary_cta_url}
                      onChange={(e) => setContent({ ...content, hero_secondary_cta_url: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Scroll Text</label>
                  <input
                    type="text"
                    value={content.hero_scroll_text}
                    onChange={(e) => setContent({ ...content, hero_scroll_text: e.target.value })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            )}

            {/* Why I Build Tab */}
            {activeTab === 'why-build' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Why I Build Section</h2>
                
                <div>
                  <label className="block text-white/80 mb-2">Section Headline</label>
                  <input
                    type="text"
                    value={content.why_build_headline}
                    onChange={(e) => setContent({ ...content, why_build_headline: e.target.value })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Intro Text</label>
                  <textarea
                    value={content.why_build_intro}
                    onChange={(e) => setContent({ ...content, why_build_intro: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Featured Quote</label>
                  <textarea
                    value={content.why_build_quote}
                    onChange={(e) => setContent({ ...content, why_build_quote: e.target.value })}
                    rows={4}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            )}

            {/* Building Principles Tab */}
            {activeTab === 'principles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Building Principles</h2>
                  <span className="text-white/60">Available icons: file, globe, window</span>
                </div>
                
                <div className="space-y-4">
                  {principles.map((principle) => (
                    <div key={principle.id} className="p-6 bg-white/5 rounded-lg border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-white/80 mb-2">Title</label>
                          <input
                            type="text"
                            value={principle.title}
                            onChange={(e) => {
                              const updated = principles.map(p => 
                                p.id === principle.id ? { ...p, title: e.target.value } : p
                              );
                              setPrinciples(updated);
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-2">Icon Name</label>
                          <input
                            type="text"
                            value={principle.icon_name}
                            onChange={(e) => {
                              const updated = principles.map(p => 
                                p.id === principle.id ? { ...p, icon_name: e.target.value } : p
                              );
                              setPrinciples(updated);
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-2">Sort Order</label>
                          <input
                            type="number"
                            value={principle.sort_order}
                            onChange={(e) => {
                              const updated = principles.map(p => 
                                p.id === principle.id ? { ...p, sort_order: parseInt(e.target.value) } : p
                              );
                              setPrinciples(updated);
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-white/80 mb-2">Description</label>
                        <textarea
                          value={principle.description}
                          onChange={(e) => {
                            const updated = principles.map(p => 
                              p.id === principle.id ? { ...p, description: e.target.value } : p
                            );
                            setPrinciples(updated);
                          }}
                          rows={2}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      
                      <button
                        onClick={() => savePrinciple(principle)}
                        className="px-4 py-2 bg-neon-cyan text-dark-900 rounded-lg hover:bg-neon-cyan/90 font-medium"
                      >
                        Save Principle
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Email</label>
                    <input
                      type="email"
                      value={content.email || ''}
                      onChange={(e) => setContent({ ...content, email: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Phone</label>
                    <input
                      type="text"
                      value={content.phone || ''}
                      onChange={(e) => setContent({ ...content, phone: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Location</label>
                  <input
                    type="text"
                    value={content.location || ''}
                    onChange={(e) => setContent({ ...content, location: e.target.value })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={content.linkedin_url || ''}
                      onChange={(e) => setContent({ ...content, linkedin_url: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={content.github_url || ''}
                      onChange={(e) => setContent({ ...content, github_url: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={content.twitter_url || ''}
                    onChange={(e) => setContent({ ...content, twitter_url: e.target.value })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Stats Section</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Project Count</label>
                    <input
                      type="number"
                      value={statsData.project_count}
                      onChange={(e) => setStatsData({ ...statsData, project_count: parseInt(e.target.value) })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">MVP Count</label>
                    <input
                      type="number"
                      value={statsData.mvp_count}
                      onChange={(e) => setStatsData({ ...statsData, mvp_count: parseInt(e.target.value) })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Live Count</label>
                    <input
                      type="number"
                      value={statsData.live_count}
                      onChange={(e) => setStatsData({ ...statsData, live_count: parseInt(e.target.value) })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Custom Stats Text</label>
                    <input
                      type="text"
                      value={statsData.custom_stats_text}
                      onChange={(e) => setStatsData({ ...statsData, custom_stats_text: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={statsData.use_custom_text}
                    onChange={(e) => setStatsData({ ...statsData, use_custom_text: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-white/80">Use Custom Stats Text</label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
