import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Client {
    _id: string;
    name: string;
    address: string;
    gstin: string;
}

interface ClientManagementProps {
    onClientSelect: (client: Client) => void;
}

const API_URL = 'https://rsbilling-ui-backend-production.up.railway.app';

const ClientManagement: React.FC<ClientManagementProps> = ({ onClientSelect }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newClient, setNewClient] = useState({
        name: '',
        address: '',
        gstin: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/clients`);
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleClientSelect = (clientId: string) => {
        setSelectedClient(clientId);
        const client = clients.find(c => c._id === clientId);
        if (client) {
            onClientSelect(client);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/clients`, newClient);
            setClients([...clients, response.data]);
            setShowAddForm(false);
            setNewClient({
                name: '',
                address: '',
                gstin: ''
            });
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Client Management</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {showAddForm ? 'Cancel' : 'Add New Client'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddClient} className="bg-white p-4 rounded shadow mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newClient.name}
                            onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="GSTIN"
                            value={newClient.gstin}
                            onChange={(e) => setNewClient({...newClient, gstin: e.target.value})}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={newClient.address}
                            onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                            className="border p-2 rounded col-span-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save Client
                    </button>
                </form>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client
                </label>
                <select
                    value={selectedClient}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ClientManagement; 