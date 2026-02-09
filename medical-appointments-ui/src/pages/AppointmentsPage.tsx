import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { getAppointmentsToday, attendAppointment } from "@/lib/api";
import { CalendarDays, UserCheck } from "lucide-react";

export default function AppointmentsPage() {
  const api = useApi();
  const [appointmentId, setAppointmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Citas</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Citas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => api.execute("GET /api/appointments/today", getAppointmentsToday)}
              disabled={api.loading}
              className="w-full"
            >
              Ver Citas del Día
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" /> Atender Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="appt-id">ID de Cita</Label>
              <Input
                id="appt-id"
                type="number"
                value={appointmentId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentId(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-id">ID de Doctor</Label>
              <Input
                id="doc-id"
                type="number"
                value={doctorId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDoctorId(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <Button
              onClick={() => api.execute("POST /api/appointments/:id/attend", () => attendAppointment(Number(appointmentId), Number(doctorId)))}
              disabled={api.loading || !appointmentId || !doctorId}
              className="w-full"
            >
              Atender Cita
            </Button>
          </CardContent>
        </Card>
      </div>

      <ResultPanel {...api} />
    </div>
  );
}