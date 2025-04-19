import { Link, useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useUser();
  
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dance", label: "Dance" },
    { href: "/nutrition", label: "Nutrition" },
    { href: "/chatbot", label: "AI Coach" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard">
              <span className="text-2xl font-poppins font-bold text-primary cursor-pointer">
                Beat<span className="text-accent">Burn</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`font-medium transition-colors ${
                  location === link.href ? "text-accent" : "text-primary hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="relative">
                <Avatar className="cursor-pointer border-2 border-primary">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border border-white"></div>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button className="text-neutral-dark hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
