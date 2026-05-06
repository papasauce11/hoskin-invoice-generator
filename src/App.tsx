import { useState, useRef } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import HelpModal from "./components/HelpModal";
import { getDefaultInvoiceData } from "./types";
import type { InvoiceData } from "./types";
import { validateInvoice } from "./utils";
import type { ValidationErrors } from "./utils";

const DEFAULT_LOGO = "/hoskin-logo.png";

function App() {
  const [data, setData] = useState<InvoiceData>(getDefaultInvoiceData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO);
  const [helpOpen, setHelpOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  function handleLogoUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleResetLogo() {
    setLogoUrl(DEFAULT_LOGO);
  }

  function handleDownloadPdf() {
    const validationErrors = validateInvoice(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const element = document.getElementById("invoice-preview");
    if (!element) return;

    import("html2pdf.js").then((mod) => {
      const html2pdf = mod.default;
      const filename = data.invoiceNumber
        ? `${data.invoiceNumber}_commercial_invoice.pdf`
        : "commercial_invoice.pdf";

      html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  }

  function handlePrint() {
    window.print();
  }

  function handleReset() {
    if (window.confirm("Are you sure you want to clear all fields and start a new invoice?")) {
      setData(getDefaultInvoiceData());
      setErrors({});
      setLogoUrl(DEFAULT_LOGO);
    }
  }

  function handleChange(newData: InvoiceData) {
    setData(newData);
    if (Object.keys(errors).length > 0) {
      setErrors(validateInvoice(newData));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Commercial Invoice Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              ? Help
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              New Invoice
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6">
        {/* Form Panel */}
        <div className="no-print w-[420px] shrink-0">
          <div className="bg-white rounded-lg shadow p-5 sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto">
            <InvoiceForm
              data={data}
              onChange={handleChange}
              errors={errors}
              logoUrl={logoUrl}
              onLogoUpload={handleLogoUpload}
              onLogoReset={handleResetLogo}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 min-w-0" ref={previewRef}>
          <div className="bg-gray-200 rounded-lg p-4 flex justify-center">
            <div className="shadow-lg">
              <InvoicePreview data={data} logoUrl={logoUrl} />
            </div>
          </div>
        </div>
      </main>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;
