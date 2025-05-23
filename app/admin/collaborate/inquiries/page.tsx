"use client";

import { useState, useEffect } from "react";
import { CollaborateInquiry } from "@/lib/supabase";

export default function AdminCollaborateInquiries() {
  const [inquiries, setInquiries] = useState<CollaborateInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter, page]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/collaborate/inquiries?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/collaborate/inquiries?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      
      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`/api/collaborate/inquiries?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'reviewed': return 'bg-yellow-500/20 text-yellow-400';
      case 'contacted': return 'bg-green-500/20 text-green-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Collaborate Inquiries</h1>
        
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="developer">Developer</option>
            <option value="investor">Investor</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glassmorphism p-4 rounded-lg">
            <h3 className="text-sm text-white/60">Total Inquiries</h3>
            <p className="text-2xl font-bold">{totalCount}</p>
          </div>
          <div className="glassmorphism p-4 rounded-lg">
            <h3 className="text-sm text-white/60">New</h3>
            <p className="text-2xl font-bold text-blue-400">
              {inquiries.filter(i => i.status === 'new').length}
            </p>
          </div>
          <div className="glassmorphism p-4 rounded-lg">
            <h3 className="text-sm text-white/60">Developers</h3>
            <p className="text-2xl font-bold text-neon-cyan">
              {inquiries.filter(i => i.inquiry_type === 'developer').length}
            </p>
          </div>
          <div className="glassmorphism p-4 rounded-lg">
            <h3 className="text-sm text-white/60">Investors</h3>
            <p className="text-2xl font-bold text-neon-violet">
              {inquiries.filter(i => i.inquiry_type === 'investor').length}
            </p>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="glassmorphism rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-white/60">No inquiries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-t border-white/10">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-sm text-white/60">{inquiry.email}</div>
                        {inquiry.company && (
                          <div className="text-sm text-white/60">{inquiry.company}</div>
                        )}
                        {inquiry.area_of_interest && (
                          <div className="text-sm text-neon-cyan">{inquiry.area_of_interest}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.inquiry_type === 'developer' 
                          ? 'bg-neon-cyan/20 text-neon-cyan' 
                          : 'bg-neon-violet/20 text-neon-violet'
                      }`}>
                        {inquiry.inquiry_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <select 
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className="text-xs px-2 py-1 bg-white/10 border border-white/20 rounded"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button 
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-2">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
