'use client';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin, List } from 'lucide-react';

interface FilterBarProps {
  filters: {
    radius: number;
    category: string;
    priceRange: [number, number];
    rating: number;
  };
  onFilterChange: (filters: any) => void;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

export function FilterBar({ filters, onFilterChange, viewMode, onViewModeChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('map')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Radius (km)</label>
          <Slider
            value={[filters.radius]}
            min={1}
            max={10}
            step={1}
            onValueChange={([value]) => onFilterChange({ ...filters, radius: value })}
          />
          <span className="text-sm text-gray-500">{filters.radius} km</span>
        </div>

        <div>
          <label className="text-sm font-medium">Price Range</label>
          <Slider
            value={filters.priceRange}
            min={0}
            max={1000}
            step={50}
            onValueChange={(value) => onFilterChange({ ...filters, priceRange: value })}
          />
          <span className="text-sm text-gray-500">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium">Minimum Rating</label>
          <Slider
            value={[filters.rating]}
            min={0}
            max={5}
            step={0.5}
            onValueChange={([value]) => onFilterChange({ ...filters, rating: value })}
          />
          <span className="text-sm text-gray-500">{filters.rating} stars</span>
        </div>
      </div>
    </div>
  );
} 