import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage Management | Admin",
  description: "Manage homepage content and settings",
};

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-900">
      {children}
    </div>
  );
}
