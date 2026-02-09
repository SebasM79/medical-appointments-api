import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { getDoctors, getDoctorSchedule, getDoctorAvailability, createDoctor } from "@/lib/api";
import { Stethoscope, Calendar, Clock, UserPlus, List } from "lucide-react";

export default function DoctorsPage() {
  const api = useApi();
  const [doctorId, setDoctorId] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", licenseNumber: "",
    address: "", phone: "", email: "", treatmentUnitId: "",
  });

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Doctores</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <List className="h-4 w-4 text-primary" /> Listar Doctores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => api.execute("GET /api/doctors", getDoctors)} disabled={api.loading} className="w-full">
              Obtener Todos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Agenda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>ID Doctor</Label>
              <Input type="number" value={doctorId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDoctorId(e.target.value)} placeholder="Ej: 1" />
            </div>
            <Button onClick={() => api.execute("GET /api/doctors/:id/schedule", () => getDoctorSchedule(Number(doctorId)))} disabled={api.loading || !doctorId} className="w-full">
              Ver Agenda
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>ID Doctor</Label>
              <Input type="number" value={doctorId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDoctorId(e.target.value)} placeholder="Ej: 1" />
            </div>
            <Button variant="secondary" onClick={() => api.execute("GET /api/doctors/:id/availability", () => getDoctorAvailability(Number(doctorId)))} disabled={api.loading || !doctorId} className="w-full">
              Ver Disponibilidad
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" /> Crear Nuevo Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input value={form.firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("firstName", e.target.value)} placeholder="Juan" />
            </div>
            <div className="space-y-1.5">
              <Label>Apellido *</Label>
              <Input value={form.lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("lastName", e.target.value)} placeholder="Pérez" />
            </div>
            <div className="space-y-1.5">
              <Label>Nro. Licencia *</Label>
              <Input value={form.licenseNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("licenseNumber", e.target.value)} placeholder="MED-12345" />
            </div>
            <div className="space-y-1.5">
              <Label>Unidad de Tratamiento *</Label>
              <Input type="number" value={form.treatmentUnitId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("treatmentUnitId", e.target.value)} placeholder="1" />
            </div>
            <div className="space-y-1.5">
              <Label>Dirección</Label>
              <Input value={form.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("address", e.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("phone", e.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("email", e.target.value)} placeholder="Opcional" />
            </div>
          </div>
          <Button
            className="mt-4 w-full sm:w-auto"
            onClick={() =>
              api.execute("POST /api/doctors/create", () =>
                createDoctor({
                  firstName: form.firstName,
                  lastName: form.lastName,
                  licenseNumber: form.licenseNumber,
                  address: form.address || null,
                  phone: form.phone || null,
                  email: form.email || null,
                  treatmentUnitId: Number(form.treatmentUnitId) || 0,
                })
              )
            }
            disabled={api.loading || !form.firstName || !form.lastName || !form.licenseNumber}
          >
            Crear Doctor
          </Button>
        </CardContent>
      </Card>

      <ResultPanel {...api} />
    </div>
  );
}