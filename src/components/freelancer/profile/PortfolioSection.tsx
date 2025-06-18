import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
}

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  return (
    <Card className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
          <Plus className="h-4 w-4 mr-2" />
          Add Work
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="group relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-xs text-white/70">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
