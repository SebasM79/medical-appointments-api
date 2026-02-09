import { Heart, CalendarDays, Stethoscope, Building2, FileText, Users, Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Activity, label: "Estado del Sistema" },
  { to: "/appointments", icon: CalendarDays, label: "Citas" },
  { to: "/doctors", icon: Stethoscope, label: "Doctores" },
  { to: "/offices", icon: Building2, label: "Consultorios" },
  { to: "/episodes", icon: FileText, label: "Episodios Médicos" },
  { to: "/users", icon: Users, label: "Usuarios" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar-background min-h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <Heart className="h-7 w-7 text-primary" fill="hsl(var(--primary))" />
        <span className="text-lg font-bold text-sidebar-foreground tracking-tight">MediSalud</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">API: localhost:5086</p>
      </div>
    </aside>
  );
}
