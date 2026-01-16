import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServicePackages } from "@/components/freelancer/profile/ServicePackages";
import { ServicesProvider } from "@/contexts/ServicesContext";

export default function ServicesPage() {
  return (
    <ServicesProvider>
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Link
                href="/freelancer/profile"
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">My Services</h1>
                <p className="text-white/50 text-xs">Manage the services you offer to clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <ServicePackages />
          </div>
        </div>
      </div>
    </ServicesProvider>
  );
}
