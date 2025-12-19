import { Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  deliveryTime: string;
  features?: string[];
  category?: string;
}

interface ServiceCardProps {
  service: Service;
  showCategoryBadge?: boolean;
  className?: string;
}

export function ServiceCard({ service, showCategoryBadge = true, className = '' }: ServiceCardProps) {
  return (
    <div className={`p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full relative ${className}`}>
      {/* Category badge */}
      {showCategoryBadge && service.category && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs">
            {service.category}
          </Badge>
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex-1 mt-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">{service.title}</h3>
          </div>

          <p className="text-white/70 mt-2 text-sm">{service.description}</p>

          {service.features && service.features.length > 0 && (
            <ul className="mt-3 space-y-2">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-white/80">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 pt-4 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-white">
                {typeof service.price === 'string' && service.price.includes('₹')
                  ? service.price
                  : `₹${service.price}`
                }
              </div>
              <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
                {service.deliveryTime}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                Hire Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
