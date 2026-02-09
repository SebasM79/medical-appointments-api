import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResultPanel } from "@/components/ResultPanel";
import { useApi } from "@/hooks/useApi";
import { updateEpisodeNotes } from "@/lib/api";
import { FileText } from "lucide-react";

export default function EpisodesPage() {
  const api = useApi();
  const [episodeId, setEpisodeId] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Episodios Médicos</h1>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Actualizar Notas de Episodio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>ID de Episodio</Label>
            <Input
              type="number"
              value={episodeId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEpisodeId(e.target.value)}
              placeholder="Ej: 1"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notas</Label>
            <Textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Escriba las notas médicas aquí..."
              rows={4}
            />
          </div>
          <Button
            onClick={() => api.execute("PUT /api/medical-episodes/:id/notes", () => updateEpisodeNotes(Number(episodeId), notes))}
            disabled={api.loading || !episodeId || !notes}
          >
            Guardar Notas
          </Button>
        </CardContent>
      </Card>

      <ResultPanel {...api} />
    </div>
  );
}
