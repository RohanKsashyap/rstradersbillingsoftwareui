import React from 'react';
import { InvoiceData } from '../types';

interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const {
    invoiceNumber,
    customerName,
    customerAddress,
    customerGST,
    customerState,
    invoiceDate,
    items,
    subtotal,
    gst,
    cgst = 0,
    sgst = 0,
    igst = 0,
    taxRate = 5,
    total,
    companyDetails
  } = invoiceData;

  return (
    <div className="invoice-template">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-purple-800 mb-2">{companyDetails.name}</h1>
          <p className="text-gray-600 whitespace-pre-line">{companyDetails.address}</p>
          <p className="text-gray-600">GSTIN: {companyDetails.gst}</p>
          <p className="text-gray-600">Phone: {companyDetails.phone}</p>
          <p className="text-gray-600">Email: {companyDetails.email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-purple-800 mb-1">TAX INVOICE</h2>
          <p className="text-gray-600">Invoice #: {invoiceNumber}</p>
          <p className="text-gray-600">Date: {new Date(invoiceDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
        <p className="font-medium">{customerName}</p>
        <p className="text-gray-600 whitespace-pre-line">{customerAddress}</p>
        {customerGST && <p className="text-gray-600">GSTIN: {customerGST}</p>}
        {customerState && <p className="text-gray-600">State: {customerState}</p>}
        <p className="text-gray-600">Vehicle Number: {invoiceData.vehicleNumber}</p>
      </div>

      <div className="mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HSN/SAC
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GST %
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GST Amt (₹)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const itemTotal = item.quantity * item.rate;
              const itemGST = (itemTotal * item.gstRate) / 100;
              
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.hsn}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.rate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {itemTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.gstRate}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {itemGST.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax Rate:</span>
            <span className="font-medium">{taxRate}%</span>
          </div>
          {igst > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-600">IGST:</span>
              <span className="font-medium">₹{igst.toFixed(2)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">CGST:</span>
                <span className="font-medium">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SGST:</span>
                <span className="font-medium">₹{sgst.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 flex justify-between">
        <div>
          <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
          <ol className="text-sm text-gray-600 list-decimal pl-4">
            <li>Payment due within 15 days of invoice date.</li>
            <li>Please make payment via bank transfer or cheque.</li>
            <li>Goods once sold cannot be returned.</li>
          </ol>
        </div>
        <div className="text-right">
          <p className="mb-12 text-gray-600">For {companyDetails.name}</p>
          <div className="mb-4">
            <img src="/rstradersstamp.jpg" alt="RS Traders & Suppliers Stamp" style={{ width: '120px', display: 'inline-block' }} />
            <div style={{ fontSize: '12px', color: '#888' }}>Authorized Stamp</div>
          </div>
          <p className="font-medium">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
