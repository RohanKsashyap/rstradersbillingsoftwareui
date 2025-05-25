import  { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Calculator, Printer, Save, FileText, Plus, Minus, Trash2 } from 'lucide-react';
import InvoiceTemplate from './components/InvoiceTemplate';
import { InvoiceData, InvoiceItem } from './types';

function App() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGST, setCustomerGST] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', hsn: '', quantity: 1, rate: 0, gstRate: 18 }
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: items.length + 1,
      description: '',
      hsn: '',
      quantity: 1,
      rate: 0,
      gstRate: 18
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateGST = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      return sum + (itemTotal * item.gstRate) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const generateInvoice = () => {
    const invoiceData: InvoiceData = {
      invoiceNumber,
      customerName,
      customerAddress,
      customerGST,
      invoiceDate,
      vehicleNumber,
      items,
      subtotal: calculateSubtotal(),
      gst: calculateGST(),
      total: calculateTotal(),
      companyDetails: {
        name: 'RS Traders & Suppliers',
        address: ' VILLAGE-PEKHUBELA, DIST-UNA, State-HIMACHAL PRADESH, PIN-174303',
        gst: '02JVDPK0923D1Z4',
        phone: '+91 7087383637',
        email: 'info@rstraders.com'
      }
    };
    
    setShowPreview(true);
    return invoiceData;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!showPreview ? (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-6 flex items-center">
              <FileText className="mr-2" /> RS Traders & Suppliers Invoice Generator
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="INV-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Customer Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={customerGST}
                    onChange={(e) => setCustomerGST(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="29AABCS1429B1Z1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Vehicle Number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Customer Address"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">Items</h2>
                <button
                  onClick={addItem}
                  className="flex items-center text-sm bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} className="mr-1" /> Add Item
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-50">
                    <tr>
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
                        GST %
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount (₹)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full p-1 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Item description"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                            className="w-full p-1 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="HSN/SAC"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20 p-1 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24 p-1 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={item.gstRate}
                            onChange={(e) => updateItem(item.id, 'gstRate', parseInt(e.target.value))}
                            className="w-20 p-1 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          ₹{(item.quantity * item.rate).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            title="Remove Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex flex-col items-end mb-6">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST:</span>
                  <span className="font-medium">₹{calculateGST().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setInvoiceNumber('');
                  setCustomerName('');
                  setCustomerAddress('');
                  setCustomerGST('');
                  setVehicleNumber('');
                  setInvoiceDate(new Date().toISOString().substring(0, 10));
                  setItems([{ id: 1, description: '', hsn: '', quantity: 1, rate: 0, gstRate: 18 }]);
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Minus size={18} className="mr-2" /> Clear Form
              </button>
              <button
                onClick={generateInvoice}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Calculator size={18} className="mr-2" /> Generate Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Edit
            </button>
            <div className="space-x-4">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Printer size={18} className="mr-2" /> Print Invoice
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Save size={18} className="mr-2" /> Save as PDF
              </button>
            </div>
          </div>
          
          <div ref={invoiceRef} className="bg-white rounded-lg shadow-md p-8 mb-8">
            <InvoiceTemplate
              invoiceData={{
                invoiceNumber,
                customerName,
                customerAddress,
                customerGST,
                invoiceDate,
                vehicleNumber,
                items,
                subtotal: calculateSubtotal(),
                gst: calculateGST(),
                total: calculateTotal(),
                companyDetails: {
                  name: 'RS Traders & Suppliers',
                  address: ' VILLAGE-PEKHUBELA, DIST-UNA, State-HIMACHAL PRADESH, PIN-174303',
                  gst: '02JVDPK0923D1Z4',
                  phone: '+91 7087383637',
                  email: 'info@rstraders.com'
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;