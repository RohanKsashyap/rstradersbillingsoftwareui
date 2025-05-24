export interface InvoiceItem {
  id: number;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number;
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
  invoiceDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  companyDetails: CompanyDetails;
}