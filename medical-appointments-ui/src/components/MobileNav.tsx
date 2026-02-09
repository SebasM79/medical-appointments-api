import { Heart, CalendarDays, Stethoscope, Building2, FileText, Users, Activity, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/", icon: Activity, label: "Estado del Sistema" },
  { to: "/appointments", icon: CalendarDays, label: "Citas" },
  { to: "/doctors", icon: Stethoscope, label: "Doctores" },
  { to: "/offices", icon: Building2, label: "Consultorios" },
  { to: "/episodes", icon: FileText, label: "Episodios Médicos" },
  { to: "/users", icon: Users, label: "Usuarios" },
];

export function MobileNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar-background">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" fill="hsl(var(--primary))" />
        <span className="text-lg font-bold text-sidebar-foreground">MediSalud</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar-background">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
            <Heart className="h-7 w-7 text-primary" fill="hsl(var(--primary))" />
            <span className="text-lg font-bold">MediSalud</span>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
