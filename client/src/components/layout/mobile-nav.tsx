import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: "home-alt" },
    { href: "/dance", label: "Dance", icon: "play-circle" },
    { href: "/nutrition", label: "Nutrition", icon: "food-menu" },
    { href: "/chatbot", label: "AI Coach", icon: "message-rounded-dots" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <div className="flex justify-around">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center py-3 ${
              location === link.href ? "text-accent" : "text-neutral-dark"
            }`}
          >
            <i className={`bx bx-${link.icon} text-2xl`}></i>
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
