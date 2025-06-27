import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { PortfolioSection } from "@/components/freelancer/profile/PortfolioSection";
import { AddWorkButton } from "@/components/freelancer/AddWorkButton";

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">My Portfolio</h1>
          </div>
          <AddWorkButton />
        </div>
        <p className="text-white/60 mt-2">Showcase your best work and achievements to potential clients</p>
      </div>

      <PortfolioSection />
    </div>
  );
}
