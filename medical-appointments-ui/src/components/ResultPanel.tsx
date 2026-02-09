import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ResultPanelProps {
  loading: boolean;
  error: string | null;
  data: unknown;
  lastRequest?: string;
}

export function ResultPanel({ loading, error, data, lastRequest }: ResultPanelProps) {
  return (
    <Card className="mt-6 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Resultado
          {lastRequest && (
            <span className="text-xs text-muted-foreground font-normal">— {lastRequest}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {!loading && !error && data !== null && data !== undefined && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <pre className="text-xs bg-muted/50 rounded-md p-3 overflow-auto max-h-80 w-full">
              {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        {!loading && !error && data === null && (
          <p className="text-sm text-muted-foreground">Sin resultados aún. Ejecuta una acción.</p>
        )}
      </CardContent>
    </Card>
  );
}