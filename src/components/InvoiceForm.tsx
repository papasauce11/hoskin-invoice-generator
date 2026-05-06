import { LOCATIONS } from "../config/locations";
import { CURRENCIES, UNITS_OF_MEASURE } from "../config/locations";
import type { InvoiceData, LineItem } from "../types";
import { createEmptyLineItem } from "../types";
import { calcLineTotal, formatCurrency } from "../utils";
import type { ValidationErrors } from "../utils";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  errors: ValidationErrors;
  logoUrl: string;
  onLogoUpload: (file: File) => void;
  onLogoReset: () => void;
}

function fieldClass(error?: string): string {
  return `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
  }`;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1 mb-3 mt-6 first:mt-0">
      {title}
    </h3>
  );
}

export default function InvoiceForm({ data, onChange, errors, logoUrl, onLogoUpload, onLogoReset }: Props) {
  function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    const items = [...data.lineItems];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, lineItems: items });
  }

  function addLineItem() {
    onChange({ ...data, lineItems: [...data.lineItems, createEmptyLineItem()] });
  }

  function removeLineItem(index: number) {
    if (data.lineItems.length <= 1) return;
    const items = data.lineItems.filter((_, i) => i !== index);
    onChange({ ...data, lineItems: items });
  }

  function duplicateLineItem(index: number) {
    const items = [...data.lineItems];
    const copy = { ...items[index], id: crypto.randomUUID() };
    items.splice(index + 1, 0, copy);
    onChange({ ...data, lineItems: items });
  }

  function handleLocationChange(value: string) {
    const loc = LOCATIONS.find((l) => l.label === value);
    onChange({
      ...data,
      shipFromLocation: value,
      shipperAddress: loc?.address ?? "",
    });
  }

  return (
    <div className="space-y-2">
      {/* Logo */}
      <SectionHeader title="Logo" />
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden flex items-center justify-center bg-white shrink-0">
          <img src={logoUrl} alt="Invoice logo" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50 text-center">
            Upload Logo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onLogoUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          {logoUrl !== "/hoskin-logo.png" && (
            <button
              type="button"
              onClick={onLogoReset}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              Reset to default
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Shipper */}
      <SectionHeader title="Shipper / Exporter" />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Ship-from Location</label>
        <select
          className={fieldClass()}
          value={data.shipFromLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc.label} value={loc.label}>{loc.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Shipper Name</label>
        <input
          className={fieldClass()}
          value={data.shipperName}
          onChange={(e) => update("shipperName", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Shipper Address</label>
        <textarea
          className={fieldClass()}
          rows={2}
          value={data.shipperAddress}
          onChange={(e) => update("shipperAddress", e.target.value)}
        />
      </div>

      {/* Section 2: Invoice Details */}
      <SectionHeader title="Invoice Details" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date of Export</label>
          <input
            type="date"
            className={fieldClass()}
            value={data.dateOfExport}
            onChange={(e) => update("dateOfExport", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Commercial Invoice # *</label>
          <input
            className={fieldClass(errors.invoiceNumber)}
            value={data.invoiceNumber}
            onChange={(e) => update("invoiceNumber", e.target.value)}
            placeholder="INV-0001"
          />
          {errors.invoiceNumber && <span className="text-xs text-red-500">{errors.invoiceNumber}</span>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Reference #</label>
        <input
          className={fieldClass()}
          value={data.referenceNumber}
          onChange={(e) => update("referenceNumber", e.target.value)}
        />
      </div>

      {/* Section 3: Recipient */}
      <SectionHeader title="Recipient (Consignee)" />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Company Name *</label>
        <input
          className={fieldClass(errors.recipientCompanyName)}
          value={data.recipientCompanyName}
          onChange={(e) => update("recipientCompanyName", e.target.value)}
        />
        {errors.recipientCompanyName && <span className="text-xs text-red-500">{errors.recipientCompanyName}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Address *</label>
        <textarea
          className={fieldClass(errors.recipientAddress)}
          rows={3}
          value={data.recipientAddress}
          onChange={(e) => update("recipientAddress", e.target.value)}
        />
        {errors.recipientAddress && <span className="text-xs text-red-500">{errors.recipientAddress}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Country</label>
        <input
          className={fieldClass()}
          value={data.recipientCountry}
          onChange={(e) => update("recipientCountry", e.target.value)}
        />
      </div>

      {/* Section 4: Importer */}
      <SectionHeader title="Importer" />
      <div className="flex items-center gap-2 mb-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={data.importerSameAsRecipient}
            onChange={(e) => update("importerSameAsRecipient", e.target.checked)}
          />
          <div className="w-9 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
        <span className="text-sm text-gray-600">Same as recipient</span>
      </div>
      {!data.importerSameAsRecipient && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Importer Company Name</label>
            <input
              className={fieldClass()}
              value={data.importerCompanyName}
              onChange={(e) => update("importerCompanyName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Importer Address</label>
            <textarea
              className={fieldClass()}
              rows={3}
              value={data.importerAddress}
              onChange={(e) => update("importerAddress", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Section 5: Shipment Details */}
      <SectionHeader title="Shipment Details" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Country of Export</label>
          <input
            className={fieldClass()}
            value={data.countryOfExport}
            onChange={(e) => update("countryOfExport", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Country of Ultimate Destination</label>
          <input
            className={fieldClass()}
            value={data.countryOfDestination}
            onChange={(e) => update("countryOfDestination", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
          <select
            className={fieldClass()}
            value={data.currency}
            onChange={(e) => update("currency", e.target.value as InvoiceData["currency"])}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Transporter Name</label>
          <input
            className={fieldClass()}
            value={data.transporterName}
            onChange={(e) => update("transporterName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Transporter Document #</label>
          <input
            className={fieldClass()}
            value={data.transporterDocNumber}
            onChange={(e) => update("transporterDocNumber", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tax ID Label</label>
          <input
            className={fieldClass()}
            value={data.taxIdLabel}
            onChange={(e) => update("taxIdLabel", e.target.value)}
            placeholder='e.g. "Humboldt Tax ID"'
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tax ID Number</label>
          <input
            className={fieldClass()}
            value={data.taxIdNumber}
            onChange={(e) => update("taxIdNumber", e.target.value)}
            placeholder="e.g. 31-0961077"
          />
        </div>
      </div>

      {/* Section 6: Return Toggle */}
      <SectionHeader title="Return" />
      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={data.isReturn}
            onChange={(e) => update("isReturn", e.target.checked)}
          />
          <div className="w-9 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
        <span className="text-sm text-gray-600">Is this a return?</span>
      </div>

      {/* Section 7: Line Items */}
      <SectionHeader title="Line Items" />
      {errors.lineItems && (
        <p className="text-xs text-red-500 mb-2">{errors.lineItems}</p>
      )}
      <div className="space-y-3">
        {data.lineItems.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded p-3 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500">Item {index + 1}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => duplicateLineItem(index)}
                  className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Duplicate row"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  disabled={data.lineItems.length <= 1}
                  className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove row"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">HS Code</label>
                <input
                  className={fieldClass()}
                  value={item.hsCode}
                  onChange={(e) => updateLineItem(index, "hsCode", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">No. of Packages</label>
                <input
                  type="number"
                  className={fieldClass()}
                  value={item.numPackages}
                  onChange={(e) => updateLineItem(index, "numPackages", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Type of Package</label>
                <input
                  className={fieldClass()}
                  value={item.typeOfPackage}
                  onChange={(e) => updateLineItem(index, "typeOfPackage", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Full Description of Goods</label>
                <input
                  className={fieldClass()}
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                />
              </div>
              <div className="w-36">
                <label className="block text-xs text-gray-500 mb-0.5">Country of Origin</label>
                <input
                  className={fieldClass()}
                  value={item.countryOfManufacture}
                  onChange={(e) => updateLineItem(index, "countryOfManufacture", e.target.value)}
                  placeholder="e.g. UK"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Qty</label>
                <input
                  type="number"
                  className={fieldClass()}
                  value={item.qty}
                  onChange={(e) => updateLineItem(index, "qty", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Unit of Measure</label>
                <select
                  className={fieldClass()}
                  value={UNITS_OF_MEASURE.includes(item.unitOfMeasure as any) ? item.unitOfMeasure : "__custom__"}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      updateLineItem(index, "unitOfMeasure", "");
                    } else {
                      updateLineItem(index, "unitOfMeasure", e.target.value);
                    }
                  }}
                >
                  {UNITS_OF_MEASURE.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                  <option value="__custom__">Other...</option>
                </select>
                {!UNITS_OF_MEASURE.includes(item.unitOfMeasure as any) && (
                  <input
                    className={fieldClass() + " mt-1"}
                    value={item.unitOfMeasure}
                    onChange={(e) => updateLineItem(index, "unitOfMeasure", e.target.value)}
                    placeholder="Custom unit"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Weight</label>
                <input
                  type="number"
                  className={fieldClass()}
                  value={item.weight}
                  onChange={(e) => updateLineItem(index, "weight", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Unit Value</label>
                <input
                  type="number"
                  step="0.01"
                  className={fieldClass()}
                  value={item.unitValue}
                  onChange={(e) => updateLineItem(index, "unitValue", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Total</label>
                <div className="px-3 py-2 text-sm bg-gray-100 rounded border border-gray-300 font-medium">
                  {formatCurrency(calcLineTotal(item), data.currency)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLineItem}
        className="mt-2 w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50"
      >
        + Add Line Item
      </button>

      {/* Section 8: Totals */}
      <SectionHeader title="Totals & Package Info" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Total No. of Packages</label>
          <input
            type="number"
            className={fieldClass()}
            value={data.totalPackages}
            onChange={(e) => update("totalPackages", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Weight Unit</label>
          <div className="flex rounded overflow-hidden border border-gray-300">
            {(["LBS", "KG"] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => update("weightUnit", unit)}
                className={`flex-1 py-2 text-sm font-medium ${
                  data.weightUnit === unit
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Dimensions (L x W x H)</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className={fieldClass()}
            placeholder="L"
            value={data.dimensionL}
            onChange={(e) => update("dimensionL", e.target.value)}
          />
          <input
            type="number"
            className={fieldClass()}
            placeholder="W"
            value={data.dimensionW}
            onChange={(e) => update("dimensionW", e.target.value)}
          />
          <input
            type="number"
            className={fieldClass()}
            placeholder="H"
            value={data.dimensionH}
            onChange={(e) => update("dimensionH", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Total Weight</label>
        <input
          type="number"
          className={fieldClass()}
          value={data.totalWeight}
          onChange={(e) => update("totalWeight", e.target.value)}
        />
      </div>

      {/* Section 9: Declaration */}
      <SectionHeader title="Declaration" />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Signer Name *</label>
        <input
          className={fieldClass(errors.signerName)}
          value={data.signerName}
          onChange={(e) => update("signerName", e.target.value)}
        />
        {errors.signerName && <span className="text-xs text-red-500">{errors.signerName}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Declaration Date</label>
        <input
          type="date"
          className={fieldClass()}
          value={data.declarationDate}
          onChange={(e) => update("declarationDate", e.target.value)}
        />
      </div>

      {/* Section 10: Extended Notes */}
      <SectionHeader title="Extended Notes" />
      <div>
        <textarea
          className={fieldClass()}
          rows={3}
          value={data.extendedNotes}
          onChange={(e) => update("extendedNotes", e.target.value)}
          placeholder="Additional notes (optional) — printed below the declaration on the PDF"
        />
      </div>
    </div>
  );
}
