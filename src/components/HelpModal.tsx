interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-[640px] max-h-[80vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800">Commercial Invoice Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6 text-sm text-gray-700 leading-relaxed">

          <Section title="What is a Commercial Invoice?">
            <p>
              A commercial invoice is a customs document required for international shipments. It
              describes the goods being shipped, their value, and the parties involved. Customs
              authorities use it to assess duties and taxes, and to clear goods through the border.
            </p>
          </Section>

          <Section title="Shipper / Exporter">
            <p>
              The company or person sending the goods. Select your Hoskin Scientific branch from the
              dropdown, or choose "Other" for a different origin. The name and address auto-fill but
              can be edited.
            </p>
          </Section>

          <Section title="Invoice Details">
            <Def term="Date of Export">
              The date the goods leave the country of export. Defaults to today.
            </Def>
            <Def term="Commercial Invoice #">
              Your internal invoice number for tracking. This is required and will appear
              on the PDF and in the filename when downloaded.
            </Def>
            <Def term="Reference #">
              An optional reference such as a purchase order number, quote number, or
              internal tracking code.
            </Def>
          </Section>

          <Section title="Recipient (Consignee)">
            <p>
              The company or person receiving the goods at the destination. Include the full
              company name, street address, city, postal/zip code, and country.
            </p>
          </Section>

          <Section title="Importer">
            <p>
              The party responsible for importing the goods and paying any duties/taxes.
              Often the same as the recipient — leave the toggle on if so. If a different
              company is handling import clearance, toggle it off and enter their details.
            </p>
          </Section>

          <Section title="Shipment Details">
            <Def term="Country of Export">
              Where the goods are shipping from (defaults to CANADA).
            </Def>
            <Def term="Country of Ultimate Destination">
              The final country where the goods will end up.
            </Def>
            <Def term="Transporter Name & Document #">
              The carrier/courier (e.g., FedEx, UPS, DHL) and the tracking or waybill number.
              Optional but helpful for customs.
            </Def>
            <Def term="Tax ID Label & Number">
              If the recipient's country requires a tax or VAT ID for clearance, enter the
              label (e.g., "VAT Number", "Humboldt Tax ID") and the corresponding number.
            </Def>
            <Def term="Currency">
              The currency all values on the invoice are stated in. This changes the symbol
              shown on all monetary values ($ for USD/CAD, £ for GBP, € for EUR).
            </Def>
          </Section>

          <Section title="Return Toggle">
            <p>
              Turn this on if the shipment is a return of previously purchased goods. This adds
              "Return of product" as the reason and a "Value for customs purposes" label to the
              invoice, which tells customs the goods aren't a new sale.
            </p>
          </Section>

          <Section title="Line Items">
            <p className="mb-2">Each row describes one type of product being shipped:</p>
            <Def term="HS Code (Harmonized System Code)">
              A standardized international number (usually 6-10 digits) that classifies the
              type of product for customs. For example, <strong>9015.80.20</strong> covers
              meteorological instruments. You can look up HS codes at{" "}
              <a
                href="https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2024/menu-eng.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                CBSA Customs Tariff
              </a>{" "}
              or ask your freight broker.
            </Def>
            <Def term="No. of Packages & Type">
              How many packages this line item is packed in and the package type (e.g., BOX,
              CRATE, PALLET, ENVELOPE). Optional per line.
            </Def>
            <Def term="Full Description of Goods">
              A clear, specific description of the product. Avoid vague terms like "parts" or
              "equipment" — customs may delay the shipment. Include model numbers, specifications,
              or materials when possible.
            </Def>
            <Def term="Country of Origin">
              The country where the product was manufactured or produced — not where it was
              purchased or shipped from. For example, if you're shipping a sensor made in the
              UK from your Oakville warehouse, the origin is "UK" even though export country
              is "CANADA".
            </Def>
            <Def term="Qty & Units of Measure">
              The quantity and how it's measured (EA = each, PCS = pieces, SET, M = metres,
              FT = feet, KG, LBS, L = litres). Choose "Other" to type a custom unit.
            </Def>
            <Def term="Weight">
              The weight of this line item. Optional per line — if filled in, the total weight
              auto-sums.
            </Def>
            <Def term="Unit Value & Total Value">
              The price per unit. Total Value auto-calculates as Qty × Unit Value.
            </Def>
            <p className="mt-2 text-xs text-gray-500">
              Tip: Use the <strong>Duplicate</strong> button to copy a row and modify it — useful
              for similar items with different specs.
            </p>
          </Section>

          <Section title="Totals & Package Info">
            <Def term="Total No. of Packages">
              The total number of physical packages in the entire shipment.
            </Def>
            <Def term="Dimensions (L × W × H)">
              Overall shipment dimensions. Optional.
            </Def>
            <Def term="Total Weight">
              Auto-sums from line item weights if filled in, or enter manually.
              Toggle between LBS and KG.
            </Def>
            <Def term="Total Value">
              Auto-calculated sum of all line item totals. This is the declared customs value.
            </Def>
          </Section>

          <Section title="Declaration">
            <p>
              The person signing the invoice certifies that all information is true and correct.
              Enter the signer's name — the actual signature is done by hand on the printed copy.
              The declaration date defaults to the date of export.
            </p>
          </Section>

          <Section title="Extended Notes">
            <p>
              Any additional information needed for customs or the recipient. This prints below
              the declaration on the PDF. Leave blank if not needed — it won't appear on the
              invoice.
            </p>
          </Section>

          <Section title="Tips">
            <ul className="list-disc pl-5 space-y-1">
              <li>Fill in all fields before downloading the PDF — required fields are marked with *</li>
              <li>Use the live preview on the right to check the layout as you type</li>
              <li>The PDF filename uses your invoice number automatically</li>
              <li>Click "New Invoice" to reset all fields and start fresh (with confirmation)</li>
              <li>You can upload a different company logo using the upload button at the top of the form</li>
            </ul>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-1.5">{title}</h3>
      {children}
    </div>
  );
}

function Def({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <dt className="font-semibold text-gray-800 inline">{term}: </dt>
      <dd className="inline">{children}</dd>
    </div>
  );
}
