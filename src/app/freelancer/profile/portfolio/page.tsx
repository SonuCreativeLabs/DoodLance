import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { PortfolioSection } from "@/components/freelancer/profile/PortfolioSection";

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/freelancer/profile" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Work
          </Button>
        </div>
        <p className="text-white/60 mt-2">Showcase your best work to potential clients</p>
      </div>

      <Card className="bg-[#1E1E1E] border border-white/5">
        <CardContent className="p-6">
          <PortfolioSection />
        </CardContent>
      </Card>
    </div>
  );
}
