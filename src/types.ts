import type { Currency, WeightUnit } from "./config/locations";

export interface LineItem {
  id: string;
  hsCode: string;
  countryOfManufacture: string;
  description: string;
  qty: string;
  unitOfMeasure: string;
  unitValue: string;
}

export interface InvoiceData {
  // Section 1: Shipper
  shipFromLocation: string;
  shipperName: string;
  shipperAddress: string;

  // Section 2: Invoice Details
  dateOfExport: string;
  invoiceNumber: string;
  referenceNumber: string;

  // Section 3: Recipient
  recipientCompanyName: string;
  recipientAddress: string;
  recipientCountry: string;

  // Section 4: Importer
  importerSameAsRecipient: boolean;
  importerCompanyName: string;
  importerAddress: string;

  // Section 5: Shipment Details
  countryOfExport: string;
  countryOfDestination: string;
  transporterName: string;
  transporterDocNumber: string;
  taxIdLabel: string;
  taxIdNumber: string;
  currency: Currency;

  // Section 6: Return Toggle
  isReturn: boolean;

  // Section 7: Line Items
  lineItems: LineItem[];

  // Section 8: Totals & Package Info
  totalPackages: string;
  typeOfPackage: string;
  dimensionL: string;
  dimensionW: string;
  dimensionH: string;
  totalWeight: string;
  weightUnit: WeightUnit;

  // Section 9: Declaration
  signerName: string;
  declarationDate: string;

  // Section 10: Extended Notes
  extendedNotes: string;
}

export function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    hsCode: "",
    countryOfManufacture: "",
    description: "",
    qty: "",
    unitOfMeasure: "EA",
    unitValue: "",
  };
}

export function getDefaultInvoiceData(): InvoiceData {
  const today = new Date().toISOString().split("T")[0];
  return {
    shipFromLocation: "Oakville",
    shipperName: "Hoskin Scientific Limited",
    shipperAddress: "Unit 5, 3280 South Service Road W, Oakville, ON L6L 0B1",
    dateOfExport: today,
    invoiceNumber: "",
    referenceNumber: "",
    recipientCompanyName: "",
    recipientAddress: "",
    recipientCountry: "",
    importerSameAsRecipient: true,
    importerCompanyName: "",
    importerAddress: "",
    countryOfExport: "CANADA",
    countryOfDestination: "",
    transporterName: "",
    transporterDocNumber: "",
    taxIdLabel: "",
    taxIdNumber: "",
    currency: "USD",
    isReturn: false,
    lineItems: [createEmptyLineItem()],
    totalPackages: "",
    typeOfPackage: "",
    dimensionL: "",
    dimensionW: "",
    dimensionH: "",
    totalWeight: "",
    weightUnit: "LBS",
    signerName: "",
    declarationDate: today,
    extendedNotes: "",
  };
}
