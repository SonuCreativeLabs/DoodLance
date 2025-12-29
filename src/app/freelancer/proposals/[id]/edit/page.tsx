"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, X } from 'lucide-react';

interface ProposalFormData {
  coverLetter: string;
  proposedRate: number;
  estimatedDays: number;
  skills: string[];
  attachments: string[];
}

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [formData, setFormData] = useState<ProposalFormData>({
    coverLetter: '',
    proposedRate: 0,
    estimatedDays: 0,
    skills: [],
    attachments: []
  });

  // Load application data
  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (response.ok) {
          const data = await response.json();
          setApplication(data);
          setFormData({
            coverLetter: data.proposal?.coverLetter || '',
            proposedRate: data.proposal?.proposedRate || 0,
            estimatedDays: data.proposal?.estimatedDays || 0,
            skills: data.proposal?.skills || [],
            attachments: data.proposal?.attachments || []
          });
        } else {
          console.error('Failed to load application');
          toast.error('Failed to load application details');
          router.push('/freelancer/jobs?tab=applications');
        }
      } catch (error) {
        console.error('Error loading application:', error);
        toast.error('Error loading application');
        router.push('/freelancer/jobs?tab=applications');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal: formData
        }),
      });

      if (response.ok) {
        toast.success('Proposal updated successfully');
        router.push('/freelancer/jobs?tab=applications');
      } else {
        toast.error('Failed to update proposal');
      }
    } catch (error) {
      console.error('Error saving application:', error);
      toast.error('Error saving proposal');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/freelancer/jobs?tab=applications');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-white">Application not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proposals
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Proposal</h1>
              <p className="text-gray-400 text-sm">Edit your proposal for "{application.jobTitle}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Letter *
            </label>
            <Textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Describe why you're the best fit for this job..."
              className="min-h-[120px] bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>

          {/* Proposed Rate & Estimated Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Proposed Rate (₹) *
              </label>
              <Input
                type="number"
                value={formData.proposedRate}
                onChange={(e) => setFormData(prev => ({ ...prev, proposedRate: parseInt(e.target.value) || 0 }))}
                placeholder="5000"
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Days *
              </label>
              <Input
                type="number"
                value={formData.estimatedDays}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: parseInt(e.target.value) || 0 }))}
                placeholder="7"
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Skills
            </label>
            <Input
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                skills: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
              }))}
              placeholder="Cricket Coaching, Batting Technique, Video Analysis"
              className="bg-gray-900 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
