import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">Manage your schedule here.</p>
      </div>
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-xl bg-secondary/30">
            <p className="text-muted-foreground">Schedule content coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
