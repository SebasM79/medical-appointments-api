import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { getOffices, createOffice } from "@/lib/api";
import { Plus, List } from "lucide-react";

export default function OfficesPage() {
  const api = useApi();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Consultorios</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <List className="h-4 w-4 text-primary" /> Listar Consultorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => api.execute("GET /api/offices", getOffices)} disabled={api.loading} className="w-full">
              Obtener Todos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Crear Consultorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Consultorio A"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ubicación</Label>
              <Input
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                placeholder="Piso 2, Ala Norte"
              />
            </div>
            <Button
              onClick={() => api.execute("POST /api/offices", () => createOffice({ name, location }))}
              disabled={api.loading || !name || !location}
              className="w-full"
            >
              Crear Consultorio
            </Button>
          </CardContent>
        </Card>
      </div>

      <ResultPanel {...api} />
    </div>
  );
}
