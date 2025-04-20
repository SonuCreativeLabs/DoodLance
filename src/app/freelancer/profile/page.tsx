"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditor } from "@/components/freelancer/profile/profile-editor";
import { KYCVerification } from "@/components/freelancer/profile/kyc-verification";
import { SkillMatrix } from "@/components/freelancer/profile/skill-matrix";
import { PortfolioGallery } from "@/components/freelancer/profile/portfolio-gallery";
import { RatingDisplay } from "@/components/freelancer/profile/rating-display";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push('/client')}
          className="flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4" />
          Switch to Client
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="kyc">
          <KYCVerification />
        </TabsContent>

        <TabsContent value="skills">
          <SkillMatrix />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioGallery />
        </TabsContent>

        <TabsContent value="ratings">
          <RatingDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
} 