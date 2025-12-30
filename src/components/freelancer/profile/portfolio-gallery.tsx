'use client';

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
}

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  const handleAddItem = () => {
    // This will be implemented with actual file upload
    console.log('Add portfolio item');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="max-w-3xl mx-auto w-full px-2 md:px-0 text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {items.map(item => (
            <div key={item.id} className="relative bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden flex flex-col">
              {item.type === 'image' ? (
                <Image src={item.url} alt={item.title} width={640} height={360} className="object-cover w-full h-44" />
              ) : (
                <video controls className="object-cover w-full h-44">
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
              <Button
                size="sm"
                className="absolute top-3 right-3 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 rounded-full p-2 z-10"
                onClick={() => handleRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-neutral-100 mb-1">{item.title}</h3>
                <p className="text-sm text-neutral-400 flex-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleAddItem} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>
      </section>
    </div>
  );
}