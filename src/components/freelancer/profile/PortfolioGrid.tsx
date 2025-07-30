'use client';

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  tags?: string[];
};

interface PortfolioGridProps {
  portfolioItems: PortfolioItem[];
}

export function PortfolioGrid({ portfolioItems = [] }: PortfolioGridProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolioItems.map((item) => (
        <div key={item.id} className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-200">
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDEyMDAgNjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkQyRDJEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM2QjQ2QzEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-white">{item.title}</h3>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-white/70 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {portfolioItems.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-white/60">No portfolio items to display.</p>
        </div>
      )}
    </div>
  );
}
