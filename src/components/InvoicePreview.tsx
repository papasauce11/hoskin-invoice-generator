import type { InvoiceData } from "../types";
import { calcLineTotal, calcTotalValue, formatCurrency } from "../utils";

interface Props {
  data: InvoiceData;
  logoUrl: string;
}

export default function InvoicePreview({ data, logoUrl }: Props) {
  const totalValue = calcTotalValue(data.lineItems);
  const effectiveWeight = parseFloat(data.totalWeight) || 0;
  const dimensions =
    data.dimensionL || data.dimensionW || data.dimensionH
      ? `${data.dimensionL || "-"} x ${data.dimensionW || "-"} x ${data.dimensionH || "-"}`
      : "";

  return (
    <div
      id="invoice-preview"
      className="bg-white text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11px", lineHeight: "1.4", padding: "32px 40px", width: "816px", minHeight: "1056px", boxSizing: "border-box" }}
    >
      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>
          COMMERCIAL INVOICE
        </h1>
        <img
          src={logoUrl}
          alt="Company logo"
          style={{
            maxWidth: "140px",
            maxHeight: "60px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Info Block */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2px" }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: "50%", verticalAlign: "top", borderBottom: "none" }}>
              <Row label="Date of Export" value={data.dateOfExport} />
            </td>
            <td style={{ ...cellStyle, width: "50%", verticalAlign: "top", borderBottom: "none" }}>
              <Row label="Commercial Invoice #" value={data.invoiceNumber} />
              <Row label="Reference #" value={data.referenceNumber} />
            </td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>Shipper/Exporter:</div>
              <div>{data.shipperName}</div>
              <div style={{ whiteSpace: "pre-line" }}>{data.shipperAddress}</div>
            </td>
            <td style={{ ...cellStyle, verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>Consignee:</div>
              <div>{data.recipientCompanyName}</div>
              <div style={{ whiteSpace: "pre-line" }}>{data.recipientAddress}</div>
              {data.recipientCountry && <div>{data.recipientCountry}</div>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Mid Block */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2px" }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}>
              <Row label="Country of Export" value={data.countryOfExport} />
              <Row label="Country of Ultimate Destination" value={data.countryOfDestination} />
              {data.transporterName && <Row label="Transporter Name" value={data.transporterName} />}
              {data.transporterDocNumber && <Row label="Transporter Document #" value={data.transporterDocNumber} />}
              {(data.taxIdLabel || data.taxIdNumber) && (
                <Row label={data.taxIdLabel || "Tax ID"} value={data.taxIdNumber} />
              )}
            </td>
            <td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>Importer:</div>
              {data.importerSameAsRecipient ? (
                <div>AS ABOVE</div>
              ) : (
                <>
                  <div>{data.importerCompanyName}</div>
                  <div style={{ whiteSpace: "pre-line" }}>{data.importerAddress}</div>
                </>
              )}
              {data.isReturn && (
                <>
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ fontWeight: "bold" }}>Reason: </span>Return of product
                  </div>
                  <div style={{ marginTop: "4px", fontWeight: "bold" }}>
                    Value for customs purposes
                  </div>
                </>
              )}
              <div style={{ marginTop: "8px" }}>
                <span style={{ fontWeight: "bold" }}>Currency: </span>{data.currency}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Line Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2px" }}>
        <thead>
          <tr>
            {["HS Code", "Origin", "Full Description of Goods", "Qty", "Units", "Unit Value", "Total Value"].map(
              (h, i) => (
                <th
                  key={i}
                  style={{
                    ...cellStyle,
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "9px",
                    padding: "4px 3px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id}>
              <td style={{ ...cellStyle, textAlign: "center", fontSize: "10px" }}>{item.hsCode}</td>
              <td style={{ ...cellStyle, textAlign: "center", fontSize: "10px" }}>{item.countryOfManufacture}</td>
              <td style={{ ...cellStyle, fontSize: "10px" }}>{item.description}</td>
              <td style={{ ...cellStyle, textAlign: "center", fontSize: "10px" }}>{item.qty}</td>
              <td style={{ ...cellStyle, textAlign: "center", fontSize: "10px" }}>{item.unitOfMeasure}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontSize: "10px" }}>
                {item.unitValue ? formatCurrency(parseFloat(item.unitValue) || 0, data.currency) : ""}
              </td>
              <td style={{ ...cellStyle, textAlign: "right", fontSize: "10px", fontWeight: "bold" }}>
                {calcLineTotal(item) > 0 ? formatCurrency(calcLineTotal(item), data.currency) : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Row */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: "15%", fontWeight: "bold", fontSize: "10px" }}>
              <div style={{ fontSize: "8px", color: "#666" }}>No. of Packages</div>
              {data.totalPackages}
            </td>
            <td style={{ ...cellStyle, width: "15%", fontWeight: "bold", fontSize: "10px" }}>
              <div style={{ fontSize: "8px", color: "#666" }}>Type of Package</div>
              {data.typeOfPackage}
            </td>
            <td style={{ ...cellStyle, width: "20%", fontWeight: "bold", fontSize: "10px" }}>
              <div style={{ fontSize: "8px", color: "#666" }}>Dimensions (L x W x H)</div>
              {dimensions}
            </td>
            <td style={{ ...cellStyle, width: "20%", fontWeight: "bold", fontSize: "10px" }}>
              <div style={{ fontSize: "8px", color: "#666" }}>Total Weight</div>
              {effectiveWeight > 0 ? `${effectiveWeight} ${data.weightUnit}` : ""}
            </td>
            <td style={{ ...cellStyle, width: "30%", fontWeight: "bold", fontSize: "12px", textAlign: "right" }}>
              <div style={{ fontSize: "8px", color: "#666" }}>Total Value</div>
              {formatCurrency(totalValue, data.currency)} {data.currency}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Declaration */}
      <div style={{ borderTop: "2px solid #333", paddingTop: "12px", marginTop: "8px" }}>
        <p style={{ fontSize: "10px", marginBottom: "16px", fontStyle: "italic" }}>
          I declare all the information contained in this invoice to be true and correct.
        </p>
        <div style={{ marginBottom: "8px", fontSize: "10px", fontWeight: "bold" }}>
          Signature of shipper/exporter
        </div>
        <div style={{ display: "flex", gap: "40px", fontSize: "10px" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "bold" }}>Name: </span>{data.signerName}
          </div>
        </div>
        <div style={{ marginTop: "20px", display: "flex", gap: "40px", fontSize: "10px" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "bold" }}>Signature: </span>
            <span style={{ display: "inline-block", borderBottom: "1px solid #333", width: "200px" }}>&nbsp;</span>
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>Date: </span>{data.declarationDate}
          </div>
        </div>
      </div>

      {/* Extended Notes */}
      {data.extendedNotes && (
        <div style={{ borderTop: "1px solid #ccc", marginTop: "16px", paddingTop: "12px" }}>
          <div style={{ fontWeight: "bold", fontSize: "10px", marginBottom: "4px" }}>Notes:</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{data.extendedNotes}</div>
        </div>
      )}
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #333",
  padding: "5px 6px",
  verticalAlign: "top",
};

function Row({ label, value }: { label: string; value: string }) {
  if (!value && !label) return null;
  return (
    <div style={{ marginBottom: "2px" }}>
      <span style={{ fontWeight: "bold" }}>{label}: </span>
      <span>{value}</span>
    </div>
  );
}
