'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioForm } from './profile/PortfolioSection';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioItem } from '@/contexts/PortfolioContext';

export function AddWorkButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { addPortfolioItem } = usePortfolio();
  
  const handleSave = (itemData: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...itemData,
      id: Date.now().toString() // Generate unique ID
    };
    addPortfolioItem(newItem);
    setIsOpen(false);
  };
  
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-lg"
          style={{ borderRadius: '0.5rem' }}
          aria-label="Add work"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Work</span>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="bg-[#1E1E1E] border border-white/10 shadow-xl max-w-4xl w-[calc(100%-2rem)] max-h-[90vh] p-0 rounded-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#1E1E1E] px-5 py-3">
          <DialogHeader className="space-y-0.5">
            <DialogTitle className="text-lg font-semibold text-white">
              Add New Work
            </DialogTitle>
            <p className="text-xs text-white/60">
              Add a new project to showcase in your portfolio
            </p>
          </DialogHeader>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <PortfolioForm 
            portfolio={null}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
            onValidationChange={handleValidationChange}
            hideActions={true}
          />
        </div>
        
        {/* Fixed Footer with Actions */}
        <div className="border-t border-white/10 p-4 bg-[#1E1E1E] flex-shrink-0">
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
              disabled={!isFormValid}
            >
              Add Work
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
