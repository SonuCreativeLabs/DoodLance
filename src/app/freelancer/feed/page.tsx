"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import SearchFilters from './components/SearchFilters';
import { Job } from './types';
import JobFeed from './components/JobFeedComponent';

// Dynamically import MapView with no SSR to avoid leaflet issues
const MapView = dynamic<{
  jobs: Job[];
  selectedJobId?: number;
  onMarkerClick?: (jobId: number) => void;
}>(() => import('./components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#111111]">
      <div className="animate-pulse text-white/40">Loading map...</div>
    </div>
  )
});

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Full Stack Developer Needed for E-commerce Platform",
    description: "Looking for an experienced full-stack developer to help build a modern e-commerce platform. Strong knowledge of React, Node.js, and MongoDB required.",
    budget: "₹20,000 - ₹40,000",
    duration: "2-3 months",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    postedAt: "2 hours ago",
    location: "Remote",
    proposals: 12,
    company: "TechStart Solutions",
    companyLogo: "/images/companies/techstart.png",
    type: "Full-time",
    image: "/images/jobs/ecommerce.jpg",
    coords: [77.5946, 12.9716]
  },
  {
    id: 2,
    title: "Cricket Analytics Expert for National Team",
    description: "Seeking a cricket analytics expert to analyze player performance data and provide strategic insights for team improvement. Experience with sports analytics required.",
    budget: "₹15,000 - ₹30,000",
    duration: "3 months",
    skills: ["Sports Analytics", "Data Visualization", "Statistical Analysis", "Python"],
    postedAt: "3 hours ago",
    location: "Hybrid",
    proposals: 5,
    company: "Cricket Excellence Academy",
    companyLogo: "/images/companies/cricket.png",
    type: "Contract",
    image: "/images/jobs/cricket.jpg",
    coords: [77.5746, 12.9516]
  },
  {
    id: 3,
    title: "Content Creator for Social Media",
    description: "Seeking a creative content creator to manage our social media presence. Experience with Instagram, YouTube, and TikTok content creation required.",
    budget: "₹10,000 - ₹20,000",
    duration: "Ongoing",
    skills: ["Social Media", "Content Creation", "Video Editing"],
    postedAt: "1 day ago",
    location: "Bangalore",
    proposals: 15,
    company: "Digital Vibes",
    companyLogo: "/images/companies/digitalvibes.png",
    type: "Part-time",
    image: "/images/jobs/social.jpg",
    coords: [77.6146, 12.9916]
  },
  {
    id: 4,
    title: "Professional Photographer for Events",
    description: "Looking for a skilled photographer to cover corporate events and product launches. Must have experience with event photography and professional equipment.",
    budget: "₹5,000 - ₹15,000",
    duration: "Per Event",
    skills: ["Photography", "Photo Editing", "Event Coverage"],
    postedAt: "2 days ago",
    location: "Delhi",
    proposals: 20,
    company: "Capture Studios",
    companyLogo: "/images/companies/capture.png",
    type: "Freelance",
    image: "/images/jobs/photo.jpg",
    coords: [77.6346, 12.9616]
  },
  {
    id: 5,
    title: "Cricket Academy Website Development",
    description: "Need a web developer to create a modern website for our cricket academy. The website should include features for class scheduling, player profiles, and performance tracking.",
    budget: "₹15,000 - ₹25,000",
    duration: "1-2 months",
    skills: ["HTML", "CSS", "JavaScript", "PHP"],
    postedAt: "5 hours ago",
    location: "Mumbai",
    proposals: 8,
    company: "Premier Cricket Academy",
    companyLogo: "/images/companies/cricket.png",
    type: "Contract",
    image: "/images/jobs/cricket.jpg",
    coords: [77.5746, 12.9516]
  }
]

export default function FeedPage() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll direction for navbar visibility
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setIsNavbarVisible(false);
    } else {
      // Scrolling up
      setIsNavbarVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  const [selectedJobId, setSelectedJobId] = useState<number | undefined>();
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);

  // Initialize filtered jobs
  useEffect(() => {
    setFilteredJobs(mockJobs);
  }, []);

  // Filter jobs whenever any filter criteria changes
  useEffect(() => {
    let filtered = [...mockJobs];
    console.log('Initial jobs:', filtered.length);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply location filter
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(job => job.location === selectedLocation);
      console.log('After location filter:', filtered.length);
    }

    // Apply job type filter
    if (selectedJobType !== "All") {
      filtered = filtered.filter(job => job.type === selectedJobType);
      console.log('After type filter:', filtered.length);
    }

    // Apply price range filter
    filtered = filtered.filter(job => {
      const jobBudget = parseInt(job.budget.replace(/[^0-9]/g, ''));
      return jobBudget >= priceRange[0] && jobBudget <= priceRange[1];
    });
    console.log('After price filter:', filtered.length);

    setFilteredJobs(filtered);
  }, [searchQuery, selectedLocation, selectedJobType, priceRange]);

  const handleSaveFilters = () => {
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedJobType("All");
    setPriceRange([0, 20000]);
    setSearchQuery("");
  };

  // Set initial sheet position to collapsed state (70vh)
  const initialSheetY = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 0;

  return (
    <div className="h-screen w-full bg-[#111111] relative overflow-hidden">
      {/* Map View - Always in Background */}
      <div className="absolute inset-0 z-0">
        <MapView 
          jobs={mockJobs}
          selectedJobId={selectedJobId}
          onMarkerClick={(jobId: number) => {
            setSelectedJobId(jobId);
            setIsSheetCollapsed(false);
          }}
        />
      </div>
      {/* Fixed Header - Slides up/down */}
      <motion.div 
        className="fixed left-0 right-0 z-[3] px-4 pt-3 flex flex-col items-center bg-gradient-to-b from-[#111111] to-transparent"
        initial={{ top: 0 }}
        animate={{ 
          top: isNavbarVisible ? 0 : -80,
          opacity: isNavbarVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.3,
          ease: 'easeInOut'
        }}>
        <div className="w-full max-w-md flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jobs..."
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/30 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-lg shadow-black/10"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Search Filters Modal */}
      <SearchFilters
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedJobType={selectedJobType}
        setSelectedJobType={setSelectedJobType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        handleSaveFilters={handleSaveFilters}
        handleClearFilters={handleClearFilters}
      />

      {/* Draggable Sheet */}
      <motion.div
        initial={{ y: initialSheetY }}
        animate={{ y: isSheetCollapsed ? initialSheetY : 80 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300
        }}
        drag="y"
        dragConstraints={{
          top: 80,
          bottom: initialSheetY
        }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          // If dragged up more than halfway, expand. Otherwise, collapse.
          const threshold = initialSheetY / 2;
          setIsSheetCollapsed(info.point.y > threshold);
        }}
        className="fixed inset-x-0 bottom-0 z-[4] w-full bg-[#111111] rounded-t-[32px] shadow-2xl border-t border-white/10"
        style={{
          height: '70vh',
          touchAction: 'none'
        }}
      >
        {/* Drag Handle */}
        <div className="absolute -top-3 inset-x-0 flex justify-center items-center h-12 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Content */}
        <div 
          className="h-full overflow-y-auto pb-24 px-4 pt-16 no-scrollbar"
          onScroll={handleScroll}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Available Jobs
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {filteredJobs.length} jobs found
              </p>
            </div>
          </div>
          {/* Job List */}
          <JobFeed jobs={mockJobs} />
        </div>
      </motion.div>

      {/* Floating Map Button - Only visible when list is expanded */}
      {!isSheetCollapsed && (
        <motion.div 
          className="fixed bottom-[10%] inset-x-0 mx-auto flex justify-center z-[5]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <button 
            onClick={() => setIsSheetCollapsed(true)}
            className="inline-flex items-center h-10 px-4 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
          >
            <MapIcon className="w-4 h-4" />
            <span className="text-[13px] font-medium ml-2">Map</span>
          </button>
        </motion.div>
      )}

      {/* Add global styles for no-scrollbar */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-x: auto;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 