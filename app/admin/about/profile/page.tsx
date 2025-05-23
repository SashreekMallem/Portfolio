"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
  profile_id: number;
};

type Profile = {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  resume_url: string | null;
  hidden_message: string;
};

export default function ProfileManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isAddingSocialLink, setIsAddingSocialLink] = useState(false);
  const [isDeletingSocialLink, setIsDeletingSocialLink] = useState<number | null>(null);
  
  // Form state
  const [profile, setProfile] = useState<Profile>({
    id: 1, // Assuming there's only one profile
    name: '',
    title: '',
    bio: '',
    avatar_url: null,
    resume_url: null,
    hidden_message: ''
  });
  
  const [newSocialLink, setNewSocialLink] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: ''
  });
  
  // Fetch profile data
  useEffect(() => {
    fetchProfileData();
  }, []);
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // Fetch social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .order('id');
      
      if (socialError) {
        throw socialError;
      }
      
      // Set data
      if (profileData) {
        setProfile(profileData);
      }
      
      setSocialLinks(socialData || []);
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  // Handle social link form input changes
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSocialLink({
      ...newSocialLink,
      [name]: value
    });
  };
  
  // Save profile
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (!profile.name || !profile.title || !profile.bio) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from('profile')
          .update({
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            resume_url: profile.resume_url,
            hidden_message: profile.hidden_message
          })
          .eq('id', profile.id);
        
        if (error) throw error;
      } else {
        // Create new profile record
        const { data, error } = await supabase
          .from('profile')
          .insert([{
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            resume_url: profile.resume_url,
            hidden_message: profile.hidden_message
          }])
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setProfile(data[0]);
        }
      }
      
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };
  
  // Add new social link
  const handleAddSocialLink = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsAddingSocialLink(true);
      
      if (!newSocialLink.platform || !newSocialLink.url) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Create new social link
      const { data, error } = await supabase
        .from('social_links')
        .insert([{
          platform: newSocialLink.platform,
          url: newSocialLink.url,
          icon: newSocialLink.icon || newSocialLink.platform.toLowerCase(),
          profile_id: profile.id
        }])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setSocialLinks([...socialLinks, ...data]);
        
        // Reset form
        setNewSocialLink({
          platform: '',
          url: '',
          icon: ''
        });
      }
    } catch (error) {
      console.error('Error adding social link:', error);
      alert('Failed to add social link');
    } finally {
      setIsAddingSocialLink(false);
    }
  };
  
  // Delete social link
  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social link? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeletingSocialLink(id);
      
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSocialLinks(socialLinks.filter(link => link.id !== id));
      
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Failed to delete social link');
    } finally {
      setIsDeletingSocialLink(null);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Profile Management</h1>
        <Link 
          href="/admin/dashboard" 
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Profile Information Form */}
          <motion.div
            className="glassmorphism rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Title/Tagline*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={profile.title}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    placeholder="e.g. Frontend Developer"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Bio*
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={profile.avatar_url || ''}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resume_url"
                    value={profile.resume_url || ''}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Hidden Message
                </label>
                <input
                  type="text"
                  name="hidden_message"
                  value={profile.hidden_message}
                  onChange={handleProfileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  placeholder="A personal message or easter egg"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-medium rounded-md transition-colors"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center">
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving...
                    </span>
                  ) : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Social Links Section */}
          <motion.div
            className="glassmorphism rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">Social Links</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Add New Link</h3>
              
              <form onSubmit={handleAddSocialLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Platform*
                    </label>
                    <input
                      type="text"
                      name="platform"
                      value={newSocialLink.platform}
                      onChange={handleSocialLinkChange}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                      placeholder="e.g. GitHub, Twitter, LinkedIn"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      URL*
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={newSocialLink.url}
                      onChange={handleSocialLinkChange}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                      placeholder="https://github.com/username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Icon (optional)
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={newSocialLink.icon}
                      onChange={handleSocialLinkChange}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                      placeholder="Default: platform name in lowercase"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-medium rounded-md transition-colors"
                    disabled={isAddingSocialLink}
                  >
                    {isAddingSocialLink ? (
                      <span className="flex items-center">
                        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Adding...
                      </span>
                    ) : 'Add Link'}
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Your Social Links</h3>
              
              {socialLinks.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-lg">
                  <p className="text-white/70">No social links added yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Icon</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {socialLinks.map((link) => (
                        <tr key={link.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {link.platform}
                          </td>
                          <td className="px-6 py-4 text-sm text-white/70 truncate max-w-xs">
                            <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-neon-cyan">
                              {link.url}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                            {link.icon || link.platform.toLowerCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteSocialLink(link.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              disabled={isDeletingSocialLink === link.id}
                            >
                              {isDeletingSocialLink === link.id ? (
                                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                              ) : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}