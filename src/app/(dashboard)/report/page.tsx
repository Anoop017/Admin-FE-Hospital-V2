import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report</h1>
        <p className="text-muted-foreground">Manage your report here.</p>
      </div>
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Report Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-xl bg-secondary/30">
            <p className="text-muted-foreground">Report content coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
