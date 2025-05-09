"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JobDashboard } from '@/components/freelancer/jobs/job-dashboard';
import { ProposalList } from '@/components/freelancer/proposals/proposal-list';
import { Filter, Plus } from 'lucide-react';

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-screen-xl mx-auto px-4 py-6"
    >
      <Tabs defaultValue="jobs" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between md:justify-start gap-4">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
              <TabsTrigger 
                value="jobs" 
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'jobs' ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg shadow-purple-600/20' : 'text-white/60 hover:text-white/80'}`}
              >
                My Jobs
              </TabsTrigger>
              <TabsTrigger 
                value="proposals" 
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'proposals' ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg shadow-purple-600/20' : 'text-white/60 hover:text-white/80'}`}
              >
                My Proposals
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 md:hidden">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
              >
                <Filter className="w-4 h-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group text-sm font-medium text-white/90 group-hover:text-white"
              >
                <Plus className="w-4 h-4" />
                {activeTab === 'jobs' ? 'Post Job' : 'Propose'}
              </motion.button>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
            >
              <Filter className="w-4 h-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">Filter</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group"
            >
              <Plus className="w-4 h-4 text-white/90 group-hover:text-white transition-colors duration-300" />
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                {activeTab === 'jobs' ? 'Post a Job' : 'New Proposal'}
              </span>
            </motion.button>
          </div>
        </div>

        <TabsContent value="jobs" className="mt-0">
          <JobDashboard />
        </TabsContent>

        <TabsContent value="proposals" className="mt-0">
          <ProposalList />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
} 