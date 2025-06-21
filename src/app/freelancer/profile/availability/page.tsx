import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data for availability
const days = [
  { id: 'monday', name: 'Monday', available: true, hours: '9:00 AM - 6:00 PM' },
  { id: 'tuesday', name: 'Tuesday', available: true, hours: '9:00 AM - 6:00 PM' },
  { id: 'wednesday', name: 'Wednesday', available: true, hours: '9:00 AM - 6:00 PM' },
  { id: 'thursday', name: 'Thursday', available: true, hours: '9:00 AM - 6:00 PM' },
  { id: 'friday', name: 'Friday', available: true, hours: '9:00 AM - 6:00 PM' },
  { id: 'saturday', name: 'Saturday', available: false, hours: 'Not available' },
  { id: 'sunday', name: 'Sunday', available: false, hours: 'Not available' },
];

const timezones = [
  { value: 'ist', label: 'Indian Standard Time (IST) - GMT+5:30' },
  { value: 'est', label: 'Eastern Time (ET) - GMT-5:00' },
  { value: 'pst', label: 'Pacific Time (PT) - GMT-8:00' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT) - GMT+0:00' },
];

export default function AvailabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/freelancer/profile" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div>
          <h1 className="text-2xl font-bold">My Availability</h1>
          <p className="text-white/60 mt-1">Set your working hours and timezone</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1E1E1E] border border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Working Hours
              </CardTitle>
              <CardDescription className="text-white/60">
                Set your weekly availability for client bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.id} className="flex items-center justify-between p-3 rounded-lg bg-[#2A2A2A]">
                    <div className="flex items-center gap-3">
                      <Switch 
                        id={day.id} 
                        defaultChecked={day.available} 
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <Label htmlFor={day.id} className="font-medium">
                        {day.name}
                      </Label>
                    </div>
                    <span className="text-sm text-white/60">
                      {day.available ? day.hours : 'Not available'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border border-white/5">
            <CardHeader>
              <CardTitle>Time Off</CardTitle>
              <CardDescription className="text-white/60">
                Schedule time off when you're not available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed border-white/10">
                <Calendar className="h-10 w-10 text-white/30 mb-2" />
                <p className="text-white/60 mb-2">No time off scheduled</p>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Add Time Off
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1E1E1E] border border-white/5">
            <CardHeader>
              <CardTitle>Time Zone</CardTitle>
              <CardDescription className="text-white/60">
                Set your local timezone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select
                  id="timezone"
                  className="w-full bg-[#2A2A2A] border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  defaultValue="ist"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/50">
                  Current time in your timezone: {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border border-white/5">
            <CardHeader>
              <CardTitle>Booking Notice</CardTitle>
              <CardDescription className="text-white/60">
                Set how far in advance clients can book
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    defaultValue="24"
                    className="w-20 bg-[#2A2A2A] border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-sm text-white/80">hours notice required</span>
                </div>
                <p className="text-xs text-white/50">
                  Clients must book at least this far in advance
                </p>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
