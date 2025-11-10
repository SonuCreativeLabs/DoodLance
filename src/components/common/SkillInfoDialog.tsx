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
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[10001] grid w-full max-w-[320px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#1E1E1E] p-0 shadow-lg duration-200 rounded-2xl">
          {skillInfo ? (
            <div className="relative">
              {/* Header */}
              <div className="border-b border-white/10 bg-[#1E1E1E] px-4 py-2 rounded-t-2xl">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-white">
                    {skillInfo.name}
                  </DialogPrimitive.Title>
                  <p className="text-xs text-white/60">
                    Skill Details
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-3 bg-[#1E1E1E]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">SKILL DETAILS</h4>
                    <div className="bg-[#252525] rounded-lg p-3">
                      {skillInfo.description ? (
                        <p className="text-gray-200 leading-relaxed">{skillInfo.description}</p>
                      ) : (
                        <p className="text-gray-400 italic">No description provided</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400">EXPERIENCE</h4>
                      <div className="bg-[#252525] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-200">{skillInfo.experience || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400">SKILL LEVEL</h4>
                      <div className="bg-[#252525] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            skillInfo.level === 'Expert' ? 'bg-yellow-400' :
                            skillInfo.level === 'Intermediate' ? 'bg-blue-400' : 'bg-green-400'
                          }`} />
                          <span className="text-gray-200">{skillInfo.level || 'Intermediate'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 rounded-b-2xl">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#1E1E1E] rounded-2xl">
              <p className="text-white">Loading skill information...</p>
            </div>
          )}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
