import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  shares: { [participantId: string]: number };
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: { title: string; participants: Participant[]; expenses: Expense[] }) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [importData, setImportData] = useState("");

  const handleImport = () => {
    try {
      const jsonString = decodeURIComponent(atob(importData));
      const data = JSON.parse(jsonString);
      
      // Validate data structure
      if (!data.title || !data.participants || !data.expenses) {
        throw new Error("Invalid data format");
      }

      onImport(data);
      onOpenChange(false);
      setImportData("");
      toast.success("정산 내역을 불러왔습니다");
    } catch (err) {
      toast.error("올바르지 않은 데이터입니다");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setImportData("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정산 내역 불러오기</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="내보낸 정산 내역 데이터를 붙여넣으세요"
                  className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground">
                내보낸 정산 내역 데이터를 붙여넣어 불러올 수 있습니다.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleImport}>불러오기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 