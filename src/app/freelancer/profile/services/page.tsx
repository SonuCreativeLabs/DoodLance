import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicePackages } from "@/components/freelancer/profile/ServicePackages";

// Mock data for services
const services = [
  {
    id: '1',
    title: 'Basic Website',
    description: 'A simple 5-page website with responsive design',
    price: '₹15,000',
    type: 'online' as const,
    deliveryTime: '2 weeks',
    features: [
      '5 responsive pages',
      'Contact form',
      'Basic SEO setup',
      '1 month free support'
    ]
  },
  {
    id: '2',
    title: 'E-commerce Website',
    description: 'A full-featured online store with product management',
    price: '₹50,000',
    type: 'online' as const,
    deliveryTime: '4 weeks',
    features: [
      'Product catalog',
      'Shopping cart',
      'Payment gateway integration',
      'Order management',
      '3 months free support'
    ]
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Custom UI/UX design for your application',
    price: '₹25,000',
    type: 'in-person' as const,
    deliveryTime: '3 weeks',
    features: [
      'User research',
      'Wireframing',
      'High-fidelity mockups',
      'Interactive prototypes',
      'Design system'
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/freelancer/profile" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Service Packages</h1>
            <p className="text-white/60 mt-1">Define and manage your service offerings</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      <Card className="bg-[#1E1E1E] border border-white/5">
        <CardContent className="p-6">
          <ServicePackages services={services} />
        </CardContent>
      </Card>
    </div>
  );
}
