'use client';

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Image as ImageIcon, Video, X } from "lucide-react";

interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
}

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112c4e0f8f',
      title: 'Bathroom Renovation',
      description: 'Complete bathroom renovation with modern fixtures'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://example.com/video.mp4',
      title: 'Electrical Installation',
      description: 'Smart home electrical system installation'
    }
  ]);

  const handleAddItem = () => {
    // In a real app, this would handle file upload
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112c4e0f8f',
      title: 'New Project',
      description: 'Project description'
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <Button onClick={handleAddItem} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Portfolio Item
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-video">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 