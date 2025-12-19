interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick?: () => void;
  className?: string;
}

export function PortfolioCard({ item, onClick, className = '' }: PortfolioCardProps) {
  return (
    <div
      className={`group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              target.src =
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIFRodW1ibmFpbCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
          <div className="flex justify-between items-end">
            <div className="pr-2">
              <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
              <div className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-2 py-0.5 text-xs rounded-full border mt-1">
                {item.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
