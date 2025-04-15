import { Search, MapPin, Star, Clock } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

const serviceCategories = [
  { name: 'Plumbing', icon: '🔧', color: 'bg-blue-100' },
  { name: 'Tutoring', icon: '📚', color: 'bg-green-100' },
  { name: 'Pet Care', icon: '🐾', color: 'bg-purple-100' },
  { name: 'Cleaning', icon: '🧹', color: 'bg-yellow-100' },
  { name: 'Coaching', icon: '🎯', color: 'bg-red-100' },
  { name: 'More', icon: '➕', color: 'bg-gray-100' },
]

const featuredProviders = [
  {
    id: 1,
    name: 'John Smith',
    service: 'Plumbing',
    rating: 4.8,
    reviews: 127,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    location: '2.5 km away',
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    service: 'Math Tutoring',
    rating: 4.9,
    reviews: 89,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    location: '1.8 km away',
    responseTime: 'Usually responds in 30 mins',
  },
  // Add more providers as needed
]

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for services..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Service Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <div className="grid grid-cols-3 gap-4">
            {serviceCategories.map((category) => (
              <div
                key={category.name}
                className={`${category.color} rounded-xl p-4 text-center cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Providers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Featured Providers</h2>
          <div className="space-y-4">
            {featuredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{provider.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{provider.service}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {provider.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {provider.responseTime}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1">
                        Book Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
