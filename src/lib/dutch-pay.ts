import type { DutchPayData } from "../types/dutch-pay";

export function calculateDutchPay(data: DutchPayData) {
  const { people, expenses } = data;
  const balances: Record<string, number> = {};

  // Initialize balances
  people.forEach((person) => {
    balances[person.id] = 0;
  });

  // Calculate initial balances
  expenses.forEach((expense) => {
    people.forEach((person) => {
      const amount = expense.amounts[person.id] || 0;
      balances[person.id] += amount;
    });
  });

  return balances;
}

export function encodeDutchPayData(data: DutchPayData): string {
  const jsonString = JSON.stringify(data);
  return btoa(jsonString);
}

export function decodeDutchPayData(encoded: string): DutchPayData {
  const jsonString = atob(encoded);
  return JSON.parse(jsonString);
}

export function generateShareableUrl(data: DutchPayData): string {
  const encoded = encodeDutchPayData(data);
  return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
}

export function getDutchPayDataFromUrl(): DutchPayData | null {
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data");

  if (!encodedData) return null;

  try {
    return decodeDutchPayData(encodedData);
  } catch (error) {
    console.error("Failed to decode Dutch Pay data:", error);
    return null;
  }
}
