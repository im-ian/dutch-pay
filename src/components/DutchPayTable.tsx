import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Plus } from "lucide-react";

interface Participant {
  id: string;
  name: string;
}

interface DutchPayTableProps {
  participants: Participant[];
  onAddParticipant: () => void;
}

export function DutchPayTable({ participants, onAddParticipant }: DutchPayTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            {participants.map((participant) => (
              <TableHead key={participant.id}>{participant.name}</TableHead>
            ))}
            <TableHead className="w-[50px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onAddParticipant}>
                    Add Participant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={participants.length + 2} className="h-24 text-center text-muted-foreground">
              No expenses yet
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
} 