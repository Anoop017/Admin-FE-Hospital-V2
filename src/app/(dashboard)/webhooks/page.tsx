"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Radio,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Send,
  Zap,
  Cpu,
  Database,
  Layers,
  Terminal,
  Server,
  Webhook
} from "lucide-react";
import {
  fetchWebhookSubscriptions,
  createWebhookSubscription,
  deleteWebhookSubscription,
  fetchWebhookLogs,
  publishTestEvent,
  fetchSystemHealth,
  WebhookSubscription,
  WebhookLog,
  SystemHealth
} from "@/lib/webhooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function WebhooksPage() {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Status banners
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Subscription modal state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [secretToken, setSecretToken] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "billing.paid",
    "vitals.critical",
    "appointment.created",
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Event simulator state
  const [testEvent, setTestEvent] = useState("billing.paid");
  const [dispatching, setDispatching] = useState(false);

  // Payload inspector state
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [revealSecrets, setRevealSecrets] = useState<Record<number, boolean>>({});

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadData = useCallback(async () => {
    try {
      const [subsData, logsData, healthData] = await Promise.all([
        fetchWebhookSubscriptions().catch(() => []),
        fetchWebhookLogs(30).catch(() => []),
        fetchSystemHealth().catch(() => null),
      ]);
      setSubscriptions(subsData);
      setLogs(logsData);
      if (healthData) setHealth(healthData);
    } catch (err: any) {
      console.error("Error loading webhooks:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetUrl) {
      showNotification("error", "Please provide a name and target URL.");
      return;
    }
    if (selectedEvents.length === 0) {
      showNotification("error", "Please select at least one event type.");
      return;
    }

    setSubmitting(true);
    try {
      await createWebhookSubscription({
        name,
        targetUrl,
        eventTypes: selectedEvents,
        secretToken: secretToken || undefined,
      });
      showNotification("success", `Webhook "${name}" subscribed successfully!`);
      setCreateDialogOpen(false);
      setName("");
      setTargetUrl("");
      setSecretToken("");
      loadData();
    } catch (err: any) {
      showNotification("error", err.message || "Could not register webhook.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    if (!confirm("Are you sure you want to delete this webhook subscription?")) return;
    try {
      await deleteWebhookSubscription(id);
      showNotification("success", "Webhook subscription removed from worker pool.");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete subscription.");
    }
  };

  const handleTriggerTestEvent = async () => {
    setDispatching(true);
    try {
      const mockPayload = {
        mockId: Math.floor(Math.random() * 10000),
        eventType: testEvent,
        timestamp: new Date().toISOString(),
        metadata: {
          initiator: "admin_portal_console",
          environment: "sandbox",
          hospitalUnit: "ICU-Telemetry-Main",
        },
      };

      await publishTestEvent(testEvent, mockPayload);
      showNotification("success", `Published "${testEvent}" event to Go worker queue!`);
      setTimeout(() => loadData(), 1200);
    } catch (err: any) {
      showNotification("error", err.message || "Worker event publishing failed.");
    } finally {
      setDispatching(false);
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const availableEvents = [
    "billing.paid",
    "vitals.critical",
    "vitals.warning",
    "appointment.created",
    "patient.admitted",
    "lab.completed",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : feedback.type === "error"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs hover:underline cursor-pointer ml-4 opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Webhook className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Developer & Webhooks Hub</h1>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Real-time event subscriptions, Go microservice dispatcher, worker pipeline & audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-1.5 text-xs h-9 bg-primary hover:bg-primary/90"
          >
            <Plus className="size-3.5" /> Add Webhook Target
          </Button>
        </div>
      </div>

      {/* System & Architecture Health Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Server className="size-3.5 text-emerald-500" /> Go Service
            </span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
              Port 4000
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight text-foreground my-1">
            {health?.status ? health.status.toUpperCase() : "CONNECTED"}
          </div>
          <p className="text-[11px] text-muted-foreground">High-concurrency dispatcher</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Database className="size-3.5 text-blue-500" /> PostgreSQL
            </span>
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10">
              {health?.services?.postgres || "UP"}
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight text-foreground my-1">
            {subscriptions.length} Subscriptions
          </div>
          <p className="text-[11px] text-muted-foreground">Persistent targets repository</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Zap className="size-3.5 text-amber-500" /> Worker Queue
            </span>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
              {health?.services?.redis || "ACTIVE"}
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight text-foreground my-1">
            5 Workers
          </div>
          <p className="text-[11px] text-muted-foreground">Buffered event pipeline</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Layers className="size-3.5 text-purple-500" /> Telemetry gRPC
            </span>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10">
              Port 50051
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight text-foreground my-1">
            Stream Active
          </div>
          <p className="text-[11px] text-muted-foreground">High-frequency ICU lead stream</p>
        </Card>
      </div>

      {/* Simulator Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Play className="size-4 text-primary" /> Test Event Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Trigger real hospital domain events to test worker queueing, exponential retries, and delivery to active endpoints.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Worker Ingestion
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <select
                value={testEvent}
                onChange={(e) => setTestEvent(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {availableEvents.map((evt) => (
                  <option key={evt} value={evt}>
                    {evt}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleTriggerTestEvent}
              disabled={dispatching}
              className="gap-2 text-xs h-9 bg-primary hover:bg-primary/90"
            >
              <Send className={`size-3.5 ${dispatching ? "animate-pulse" : ""}`} />
              {dispatching ? "Dispatching..." : "Fire Test Event"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registered Webhooks List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Registered Webhook Endpoints</CardTitle>
            <CardDescription className="text-xs">
              HTTP POST targets receiving synchronous webhook dispatch events from the Go worker pool.
            </CardDescription>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {subscriptions.length} registered
          </span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Webhook className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No webhook targets registered</p>
              <p className="text-xs mt-1">Register a target URL (e.g. Webhook.site or your microservice endpoint) to begin receiving events.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target Name</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Subscribed Events</TableHead>
                    <TableHead>HMAC Secret</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => {
                    const isSecretShown = revealSecrets[sub.id];
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-semibold text-foreground">
                          {sub.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-xs truncate text-muted-foreground">
                          {sub.targetUrl}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {sub.eventTypes?.map((et) => (
                              <Badge key={et} variant="secondary" className="text-[10px] font-mono">
                                {et}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <span>
                              {sub.secretToken
                                ? isSecretShown
                                  ? sub.secretToken
                                  : "••••••••••••"
                                : "None"}
                            </span>
                            {sub.secretToken && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealSecrets((prev) => ({
                                    ...prev,
                                    [sub.id]: !prev[sub.id],
                                  }))
                                }
                                className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                                title={isSecretShown ? "Hide" : "Reveal"}
                              >
                                {isSecretShown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                              </button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              sub.isActive
                                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                : "text-muted-foreground"
                            }
                          >
                            {sub.isActive ? "ACTIVE" : "PAUSED"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubscription(sub.id)}
                            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete Subscription"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Delivery & Dispatch Audit Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Webhook Delivery Logs</CardTitle>
            <CardDescription className="text-xs">
              Historical audit trail of outgoing webhook dispatches, HTTP response codes, and payload delivery.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Audit Trail
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Clock className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No dispatch records found</p>
              <p className="text-xs mt-1">Dispatch records will appear here as hospital events are triggered and delivered.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>HTTP Status</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead className="text-right">Payload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const isOk = log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300;
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "-"}
                        </TableCell>
                        <TableCell className="font-medium text-xs">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {log.eventType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #{log.subscriptionId}
                        </TableCell>
                        <TableCell>
                          {log.responseStatus ? (
                            <span
                              className={`font-mono text-xs font-semibold px-1.5 py-0.5 rounded ${
                                isOk
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {log.responseStatus}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={log.status === "SUCCESS" ? "default" : "destructive"}
                            className="text-[10px] uppercase font-mono"
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.attemptCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLog(log)}
                            className="h-7 text-xs gap-1"
                          >
                            <Terminal className="size-3" /> Inspect
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Webhook Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register Webhook Target</DialogTitle>
            <DialogDescription>
              Subscribe an external service to hospital workflow and clinical telemetry events.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubscription} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="webhook-name">Endpoint Friendly Name</Label>
              <Input
                id="webhook-name"
                placeholder="e.g. Billing Sync Webhook / Slack Bot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="webhook-url">Target URL (HTTPS Endpoint)</Label>
              <Input
                id="webhook-url"
                placeholder="https://webhook.site/..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="webhook-secret">HMAC Signature Secret (Optional)</Label>
              <Input
                id="webhook-secret"
                placeholder="Custom secret or leave empty for auto-generated"
                value={secretToken}
                onChange={(e) => setSecretToken(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Subscribed Event Types</Label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {availableEvents.map((evt) => {
                  const isChecked = selectedEvents.includes(evt);
                  return (
                    <button
                      type="button"
                      key={evt}
                      onClick={() => toggleEvent(evt)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-mono text-left transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                      }`}
                    >
                      <span>{evt}</span>
                      {isChecked && <CheckCircle2 className="size-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
                {submitting ? "Registering..." : "Register Webhook"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inspect Log Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Dispatch Details (Log #{selectedLog?.id})</DialogTitle>
            <DialogDescription>
              Dispatched event: <span className="font-mono font-semibold">{selectedLog?.eventType}</span> • Status: <span className="font-semibold">{selectedLog?.status}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 pt-2 text-xs">
              <div>
                <Label className="text-xs text-muted-foreground">Target Subscription ID</Label>
                <p className="font-mono mt-0.5">#{selectedLog.subscriptionId}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">HTTP Response Status</Label>
                <p className="font-mono mt-0.5">
                  {selectedLog.responseStatus ? `HTTP ${selectedLog.responseStatus}` : "No response / Network error"}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Event JSON Payload</Label>
                <pre className="mt-1 p-3 rounded-lg bg-muted font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              {selectedLog.responseBody && (
                <div>
                  <Label className="text-xs text-muted-foreground">Response Body</Label>
                  <pre className="mt-1 p-3 rounded-lg bg-muted font-mono text-[11px] overflow-x-auto">
                    {selectedLog.responseBody}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
