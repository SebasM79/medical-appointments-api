import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { checkHealth, pingAppointments } from "@/lib/api";
import { Activity, Wifi } from "lucide-react";

export default function HealthPage() {
  const api = useApi();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Estado del Sistema</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => api.execute("GET /api/health", checkHealth)}
              disabled={api.loading}
              className="w-full"
            >
              Verificar Estado
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" /> Ping Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              onClick={() => api.execute("GET /api/appointments/ping", pingAppointments)}
              disabled={api.loading}
              className="w-full"
            >
              Ping Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
      <ResultPanel {...api} />
    </div>
  );
}
