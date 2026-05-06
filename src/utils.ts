import type { Currency } from "./config/locations";
import { CURRENCY_SYMBOLS } from "./config/locations";
import type { LineItem } from "./types";

export function formatCurrency(value: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = Math.abs(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

export function calcLineTotal(item: LineItem): number {
  const qty = parseFloat(item.qty) || 0;
  const unitValue = parseFloat(item.unitValue) || 0;
  return qty * unitValue;
}

export function calcTotalValue(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + calcLineTotal(item), 0);
}


export interface ValidationErrors {
  invoiceNumber?: string;
  recipientCompanyName?: string;
  recipientAddress?: string;
  lineItems?: string;
  signerName?: string;
}

export function validateInvoice(data: {
  invoiceNumber: string;
  recipientCompanyName: string;
  recipientAddress: string;
  lineItems: LineItem[];
  signerName: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.invoiceNumber.trim()) errors.invoiceNumber = "Required";
  if (!data.recipientCompanyName.trim()) errors.recipientCompanyName = "Required";
  if (!data.recipientAddress.trim()) errors.recipientAddress = "Required";
  if (!data.signerName.trim()) errors.signerName = "Required";

  const hasValidItem = data.lineItems.some(
    (item) =>
      item.description.trim() &&
      parseFloat(item.qty) > 0 &&
      parseFloat(item.unitValue) > 0
  );
  if (!hasValidItem) errors.lineItems = "At least one complete line item required";

  return errors;
}
