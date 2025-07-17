import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard' },
  { name: 'Projects', href: '/freelancer/projects' },
  { name: 'Messages', href: '/freelancer/messages' },
  { name: 'Earnings', href: '/freelancer/earnings' },
  { name: 'Profile', href: '/freelancer/profile' },
];

export function FreelancerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
