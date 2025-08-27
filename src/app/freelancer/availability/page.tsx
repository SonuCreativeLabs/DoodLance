"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import dynamic from "next/dynamic";
import HourSelector from '@/components/ui/HourSelector';
import "react-clock/dist/Clock.css";
import { Slider } from "@mui/material";
import { Box } from "@mui/material";

const TimePicker = dynamic(() => import("react-time-picker"), { ssr: false });

function formatDate(date: Date) {
  const d = date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AvailabilityPage() {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
    key: string;
  }>({
    startDate: new Date(),
    endDate: addDays(new Date(), 6),
    key: 'selection',
  });
  const [fromTimeWeekday, setFromTimeWeekday] = useState<string | null>("09:00");
  const [toTimeWeekday, setToTimeWeekday] = useState<string | null>("18:00");
  const [fromTimeWeekend, setFromTimeWeekend] = useState<string | null>("10:00");
  const [toTimeWeekend, setToTimeWeekend] = useState<string | null>("16:00");
  const [area, setArea] = useState<number>(10);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // TODO: Save logic (API call or local state update)
    setTimeout(() => setSaving(false), 1000);
  };

  const handleCreateNew = () => {
    // TODO: Handle create new availability
    console.log("Create new availability");
  };

  return (
    <div className="max-w-4xl mx-auto w-full text-neutral-100">
      <PageHeader
        title="My Availability"
        description="Set your working hours and timezone"
        backLink="/freelancer/profile"
      />
      
      <div className="mb-6">
        <Button
          onClick={handleCreateNew}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Availability
        </Button>
      </div>
      <form
        className="space-y-6"
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label className="block mb-2 text-neutral-200 text-sm font-medium">Available Date Range</label>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white">
            <DateRange
              ranges={[dateRange]}
              onChange={item => {
                const sel = item.selection;
                setDateRange({
                  startDate: sel.startDate || new Date(),
                  endDate: sel.endDate || sel.startDate || new Date(),
                  key: sel.key || 'selection',
                });
              }}
              moveRangeOnFirstSelection={false}
              rangeColors={["#a78bfa"]} // soft purple
              color="#a78bfa"
              showDateDisplay={false}
            />
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-4">
          <label className="block mb-4 text-neutral-800 text-base font-semibold">Available Time</label>
          <Tabs defaultValue="weekday" className="w-full">
            <TabsList className="w-full flex mb-4 gap-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <TabsTrigger 
                value="weekday" 
                className="flex-1 flex items-center justify-center border-none bg-transparent text-gray-700 font-semibold py-2 px-0 shadow-none rounded-none data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-purple-500 transition-colors duration-200"
              >
                Weekday <span className="ml-2 px-2 py-0.5 rounded bg-purple-100 text-xs text-purple-700">Mon-Fri</span>
              </TabsTrigger>
              <TabsTrigger 
                value="weekend" 
                className="flex-1 flex items-center justify-center border-none bg-transparent text-gray-700 font-semibold py-2 px-0 shadow-none rounded-none data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 transition-colors duration-200"
              >
                Weekend <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-xs text-yellow-700">Sat-Sun</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="weekday">
              <div className="flex gap-2 md:gap-4">
                <div className="flex-1">
                  <HourSelector
                    label="From"
                    value={fromTimeWeekday || ''}
                    onChange={v => setFromTimeWeekday(v)}
                  />
                </div>
                <div className="flex-1">
                  <HourSelector
                    label="To"
                    value={toTimeWeekday || ''}
                    onChange={v => setToTimeWeekday(v)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="weekend">
              <div className="flex gap-2 md:gap-4">
                <div className="flex-1">
                  <HourSelector
                    label="From"
                    value={fromTimeWeekend || ''}
                    onChange={v => setFromTimeWeekend(v)}
                  />
                </div>
                <div className="flex-1">
                  <HourSelector
                    label="To"
                    value={toTimeWeekend || ''}
                    onChange={v => setToTimeWeekend(v)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-8">
          <label className="block mb-2 text-neutral-200 text-sm font-medium">Service Area</label>
          <Box sx={{ width: '100%', px: 2, pt: 3, pb: 1 }}>
            <div className="flex items-center justify-between w-full mb-2 text-xs text-neutral-400">
              <span>0 km</span>
              <span className="font-semibold text-purple-700 text-base">{area} km</span>
              <span>100+ km</span>
            </div>
            <Slider
              value={area}
              onChange={(_event: Event, val: number | number[]) => setArea(Array.isArray(val) ? val[0] : val)}
              min={0}
              max={100}
              step={1}
              sx={{
                color: '#a78bfa',
                height: 8,
                borderRadius: 4,
                '& .MuiSlider-thumb': { boxShadow: 0, width: 24, height: 24, backgroundColor: '#fff', border: '3px solid #a78bfa' },
                '& .MuiSlider-rail': { background: '#ede9fe', opacity: 1 },
                '& .MuiSlider-track': { background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)', border: 'none' },
              }}
            />
          </Box>
        </div>
        <div className="flex justify-end mt-8">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition-all" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
