
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Image, User, Menu, X, Instagram, Twitter, Facebook, Newspaper, Mail, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ href, icon, label, collapsed }: SidebarLinkProps) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-portfolio-accent text-white"
            : "text-portfolio-text hover:bg-gray-100 hover:text-portfolio-accent hover:scale-105",
          collapsed && "justify-center px-2"
        )
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const PortfolioSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Portfolio", href: "/portfolio", icon: <Image className="h-5 w-5" /> },
    { label: "Pic-Time", href: "https://seanonamade.pic-time.com/portfolio", icon: <Camera className="h-5 w-5" />, external: true },
    { label: "About", href: "/about", icon: <User className="h-5 w-5" /> }
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/sdo.photos/", icon: <Instagram className="h-5 w-5" /> },
    // { label: "Twitter", href: "https://x.com/OnamadeSean", icon: <Twitter className="h-5 w-5" /> },
    { label: "Hustler", href: "https://vanderbilthustler.com/staff_name/sean-onamade/", icon: <Newspaper className="h-5 w-5" /> },
    // { label: "Mail", href: "sean.d.onamade@vanderbilt.edu", icon: <Mail className="h-5 w-5" /> },
    // { label: "Facebook", href: "https://facebook.com", icon: <Facebook className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0 transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <span className="font-medium">Sean Onamade</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {navigation.map((item) => 
        item.external ? (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all " +
              "text-portfolio-text hover:bg-gray-100 hover:text-portfolio-accent hover:scale-105",
            collapsed && "justify-center px-2"
          )}
        >
          {item.icon}
          {!collapsed && item.label}
        </a>
      ) : (
        <SidebarLink
          key={item.label}
          href={item.href}
          icon={item.icon}
          label={item.label}
          collapsed={collapsed}
        />
      )
    )}
      </div>

      <div className="mt-auto border-t border-gray-200 p-3">
        <div className={cn("flex gap-0.5", collapsed ? "justify-center" : "")}>
          {socialLinks.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-text hover:text-portfolio-accent transition-colors p-1.5 hover:scale-110"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSidebar;
