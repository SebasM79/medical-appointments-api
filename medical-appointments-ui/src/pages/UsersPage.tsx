import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { callApi } from "@/lib/api";
import { Users, UserPlus, Search, List } from "lucide-react";

export default function UsersPage() {
  const api = useApi();

  // Search/list
  const [searchId, setSearchId] = useState("");

  // Create form
  const [newUser, setNewUser] = useState({
    firstName: "", lastName: "", email: "", phone: "", role: "patient",
    documentNumber: "", documentType: "DNI",
  });

  const updateNewUser = (field: string, value: string) =>
    setNewUser((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <List className="h-4 w-4 text-primary" /> Listar Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => api.execute("GET /api/users", () => callApi("GET", "/api/users"))}
              disabled={api.loading}
              className="w-full"
            >
              Obtener Todos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Buscar Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>ID de Usuario</Label>
              <Input
                type="number"
                value={searchId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => api.execute(`GET /api/users/${searchId}`, () => callApi("GET", `/api/users/${searchId}`))}
              disabled={api.loading || !searchId}
              className="w-full"
            >
              Buscar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Por Rol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {["patient", "doctor", "admin", "receptionist"].map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant="outline"
                  onClick={() => api.execute(`GET /api/users?role=${role}`, () => callApi("GET", `/api/users?role=${role}`))}
                  disabled={api.loading}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" /> Crear Nuevo Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input
                value={newUser.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser("firstName", e.target.value)}
                placeholder="María"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Apellido *</Label>
              <Input
                value={newUser.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser("lastName", e.target.value)}
                placeholder="García"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser("email", e.target.value)}
                placeholder="maria@ejemplo.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input
                value={newUser.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser("phone", e.target.value)}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo Documento</Label>
              <Select value={newUser.documentType} onValueChange={(v: string) => updateNewUser("documentType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                  <SelectItem value="CUIL">CUIL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nro. Documento *</Label>
              <Input
                value={newUser.documentNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser("documentNumber", e.target.value)}
                placeholder="12345678"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rol *</Label>
              <Select value={newUser.role} onValueChange={(v: string) => updateNewUser("role", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Paciente</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="receptionist">Recepcionista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mt-4"
            onClick={() =>
              api.execute("POST /api/users", () =>
                callApi("POST", "/api/users", {
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  email: newUser.email,
                  phone: newUser.phone || null,
                  role: newUser.role,
                  documentNumber: newUser.documentNumber,
                  documentType: newUser.documentType,
                })
              )
            }
            disabled={api.loading || !newUser.firstName || !newUser.lastName || !newUser.email || !newUser.documentNumber}
          >
            Crear Usuario
          </Button>
        </CardContent>
      </Card>

      <ResultPanel {...api} />
    </div>
  );
}
