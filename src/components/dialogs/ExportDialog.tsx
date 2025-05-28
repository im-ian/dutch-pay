import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportData: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  exportData,
}: ExportDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    toast.success("정산 내역이 클립보드에 복사되었습니다");
  };

  const handleCopyShareLink = () => {
    const shareLink = `${window.location.origin}${window.location.pathname}?data=${exportData}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("공유 링크가 클립보드에 복사되었습니다");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정산 내역 내보내기</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <textarea
                  value={exportData}
                  readOnly
                  className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                정산 내역을 다른 기기에서 불러오려면 위 데이터를 복사하거나 공유 링크를 사용하세요.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="order-1 sm:order-1">닫기</AlertDialogCancel>
          <div className="flex gap-2 w-full sm:w-auto order-2 sm:order-2">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              데이터 복사
            </Button>
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={handleCopyShareLink}
            >
              <Download className="h-4 w-4 mr-2" />
              공유 링크 복사
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 