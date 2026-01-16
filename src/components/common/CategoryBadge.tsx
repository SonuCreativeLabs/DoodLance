import React from 'react';
import { SERVICE_CATEGORIES, PORTFOLIO_CATEGORIES, ServiceCategory, PortfolioCategory } from '@/constants/categories';

interface CategoryBadgeProps {
  category: string;
  type?: 'service' | 'portfolio' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryBadge({ category, type = 'auto', size = 'sm', className = '' }: CategoryBadgeProps) {
  // Auto-detect category type
  const categoryType = type === 'auto'
    ? (SERVICE_CATEGORIES.includes(category as ServiceCategory) ? 'service' : 'portfolio')
    : type;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const baseClasses = `inline-flex items-center rounded-full font-medium whitespace-nowrap border backdrop-blur-sm ${sizeClasses[size]} ${className}`;

  const serviceClasses = 'bg-white/10 text-white/80 border-white/20';
  const portfolioClasses = 'bg-purple-500/10 text-purple-300 border-purple-500/30';

  const classes = categoryType === 'service' ? serviceClasses : portfolioClasses;

  return (
    <span className={`${baseClasses} ${classes}`}>
      {category}
    </span>
  );
}

// Category selector component for forms
interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'service' | 'portfolio';
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  type,
  placeholder = "Select a category",
  required = false,
  className = ''
}: CategorySelectProps) {
  const categories = type === 'service' ? SERVICE_CATEGORIES : PORTFOLIO_CATEGORIES;

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderRadius: '0.5rem' }}
        className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
        required={required}
      >
        <option value="" disabled>{placeholder}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

// Category filter component
interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  type: 'service' | 'portfolio';
  className?: string;
}

export function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  type,
  className = ''
}: CategoryFilterProps) {
  const categories = type === 'service' ? SERVICE_CATEGORIES : PORTFOLIO_CATEGORIES;

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isSelected
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
