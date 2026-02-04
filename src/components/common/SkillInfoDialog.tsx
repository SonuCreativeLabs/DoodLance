'use client';

import { Clock } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SkillInfo } from "@/utils/skillUtils";

interface SkillInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  skillInfo: SkillInfo | null;
}

export function SkillInfoDialog({ isOpen, onClose, skillInfo }: SkillInfoDialogProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[10000] bg-black/80" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[10001] w-[95%] max-w-md translate-x-[-50%] translate-y-[-50%] border border-white/10 bg-[#161616] shadow-2xl duration-200 rounded-3xl p-0 overflow-hidden outline-none">
          {skillInfo ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-2">
                <DialogPrimitive.Title className="text-2xl font-bold text-white pr-8">
                  {skillInfo.name}
                </DialogPrimitive.Title>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <p className="text-white/80 leading-relaxed text-base">
                    {skillInfo.description || <span className="italic text-white/50">No description provided for this skill.</span>}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Experience */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Experience</span>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-full bg-white/5">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-white">
                        {skillInfo.experience || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Level</span>
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor] ${skillInfo.level === 'Expert' ? 'text-yellow-400 bg-yellow-400' :
                        skillInfo.level === 'Intermediate' ? 'text-blue-400 bg-blue-400' : 'text-green-400 bg-green-400'
                        }`} />
                      <span className="text-lg font-semibold text-white">
                        {skillInfo.level || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-6 border-t border-white/5">
                  <span className="text-xs text-white/30 font-medium">
                    Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/50">
              <div className="animate-pulse">Loading skill information...</div>
            </div>
          )}
          <DialogPrimitive.Close className="absolute right-4 top-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
