'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioForm } from './profile/PortfolioSection';

export function AddWorkButton() {
  const [isOpen, setIsOpen] = useState(false);
  
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
      <DialogContent className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-white/10 max-w-4xl w-[95vw] h-[90vh] p-0 rounded-2xl flex flex-col [&>button]:hidden">
        <div className="p-6 pb-0 relative">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Add New Work
            </DialogTitle>
          </DialogHeader>
          <DialogPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <PortfolioForm 
            portfolio={null}
            onSave={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
