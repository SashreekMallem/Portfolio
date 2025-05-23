"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Project } from "@/lib/supabase";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Delete project
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Filter out the deleted project from state
      setProjects((prevProjects) => prevProjects.filter(project => project.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete the project");
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      // Update the project in state
      setProjects((prevProjects) => 
        prevProjects.map(project => 
          project.id === id 
            ? { ...project, featured: !project.featured } 
            : project
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update project status");
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500/20 text-green-400";
      case "mvp": return "bg-blue-500/20 text-blue-400";
      case "in-dev": return "bg-yellow-500/20 text-yellow-400";
      case "concept": return "bg-purple-500/20 text-purple-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-neon-cyan">Projects</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-neon-cyan">Projects</h1>
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 bg-neon-cyan text-gray-900 rounded-lg hover:bg-neon-cyan/80 transition-colors"
          >
            <span className="mr-2">+</span> Add New Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neon-cyan">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 bg-neon-cyan text-gray-900 rounded-lg hover:bg-neon-cyan/80 transition-colors"
          >
            <span className="mr-2">+</span> Add New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="glassmorphism rounded-lg p-8 text-center">
            <p className="text-white/60 mb-4">No projects found</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 bg-neon-cyan text-gray-900 rounded-lg hover:bg-neon-cyan/80 transition-colors"
            >
              <span className="mr-2">+</span> Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="glassmorphism rounded-lg overflow-hidden border border-white/10 flex flex-col">
                <div className="p-4 flex items-center justify-between">
                  <div className="text-4xl">{project.emoji}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3 flex-1">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags && project.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-white/10 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex mt-auto pt-4 space-x-2 border-t border-white/10">
                    <button
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                      className="flex-1 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleFeatured(project.id, project.featured)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        project.featured ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title={project.featured ? "Remove from featured" : "Mark as featured"}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Delete project"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}