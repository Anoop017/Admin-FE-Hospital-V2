import { Edit, Trash2, CreditCard, Eye, AlertCircle, CheckCircle2, Clock, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bill } from "@/types";
import { downloadInvoicePdf } from "@/lib/reports";

interface BillTableProps {
  items: Bill[];
  onView: (item: Bill) => void;
  onEdit: (item: Bill) => void;
  onDelete: (item: Bill) => void;
  onPay: (item: Bill) => void;
}

export function BillTable({ items, onView, onEdit, onDelete, onPay }: BillTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <CreditCard className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No billing records found</p>
        <p className="text-xs text-muted-foreground mt-1">Create a new bill or try adjusting your search/filter.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1">
            <CheckCircle2 className="size-3" /> Paid
          </Badge>
        );
      case "partially_paid":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1">
            <Clock className="size-3" /> Partially Paid
          </Badge>
        );
      case "unpaid":
      default:
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="size-3" /> Unpaid
          </Badge>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Invoice #</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Patient</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Total Amount</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Paid</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Balance Due</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Due Date</th>
            <th className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="h-11 px-4 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap min-w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const total = parseFloat(String(item.totalAmount || 0));
            const paid = parseFloat(String(item.paidAmount || 0));
            const balance = Math.max(0, total - paid);
            const isOverdue = item.status !== "paid" && item.dueDate && new Date(item.dueDate) < new Date();
            const patientName = item.patient?.user
              ? `${item.patient.user.firstName} ${item.patient.user.lastName}`
              : `Patient #${item.patientId}`;
            const patientContact = item.patient?.user?.email || item.patient?.user?.mobile;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle font-mono font-medium text-foreground">
                  #{item.id}
                </td>
                <td className="p-4 align-middle">
                  <div className="font-medium text-foreground">{patientName}</div>
                  {patientContact && <div className="text-xs text-muted-foreground">{patientContact}</div>}
                </td>
                <td className="p-4 align-middle font-semibold text-foreground">
                  ${total.toFixed(2)}
                </td>
                <td className="p-4 align-middle text-emerald-600 dark:text-emerald-400 font-medium">
                  ${paid.toFixed(2)}
                </td>
                <td className="p-4 align-middle">
                  <span className={balance > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    ${balance.toFixed(2)}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <div className={`text-xs ${isOverdue ? "text-destructive font-semibold flex items-center gap-1" : "text-muted-foreground"}`}>
                    {item.dueDate ? item.dueDate.split("T")[0] : "—"}
                    {isOverdue && <span className="rounded bg-destructive/10 px-1 py-0.2 text-[10px]">Overdue</span>}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  {getStatusBadge(item.status)}
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Details */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Bill Details"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onView(item)}
                    >
                      <Eye className="size-4" />
                    </Button>

                    {/* Download Invoice PDF */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Invoice PDF"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => downloadInvoicePdf(item.id)}
                    >
                      <FileDown className="size-4" />
                    </Button>

                    {/* Record Payment */}
                    {item.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Record Payment"
                        className="size-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                        onClick={() => onPay(item)}
                      >
                        <CreditCard className="size-4" />
                      </Button>
                    )}

                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit Bill"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="size-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete Bill"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
