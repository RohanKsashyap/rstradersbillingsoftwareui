export interface InvoiceItem {
  id: number;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number; // kept for backward-compatibility in UI, not used in split-tax calculation
}

export interface CompanyDetails {
  name: string;
  address: string;
  gst: string;
  phone: string;
  email: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  customerGST: string;
  customerState?: string; // added for determining intra/inter-state
  invoiceDate: string;
  vehicleNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  // Split tax fields based on state
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxRate?: number; // e.g., 5 for 5%
  // Backward compatible aggregate GST (sum of cgst+sgst or igst)
  gst: number;
  total: number;
  companyDetails: CompanyDetails;
}