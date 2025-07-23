'use client';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export default function PreviewLayout({ children }: PreviewLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F] overflow-y-auto">
      {children}
    </div>
  );
}
