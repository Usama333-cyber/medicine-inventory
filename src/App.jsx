import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

// We will create these pages next, but let's import them here so our routes are wired up
import Navbar from './Components/Navbar';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import AddEditMedicine from './pages/AddEditMedicine';

function App() {
  /**
   * WHY: Lazy state initialization for localStorage.
   * We pass a function to useState so it runs ONLY ONCE when the app loads.
   * If saved data exists, parse it. Otherwise, load demo items for the demo!
   */
  const [medicines, setMedicines] = useState(() => {
    const savedData = localStorage.getItem('pharmacy_medicines');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Demo data adjusted for current timeline (2026)
    return [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        batchNumber: 'PCH-101',
        category: 'Tablet',
        price: 5.50,
        quantity: 120,
        mfgDate: '2025-01-10',
        expiryDate: '2027-06-30' // Safe
      },
      {
        id: '2',
        name: 'Amoxicillin Syrup',
        batchNumber: 'AMX-202',
        category: 'Syrup',
        price: 12.00,
        quantity: 8, // Low stock warning test (< 10)
        mfgDate: '2025-08-01',
        expiryDate: '2026-11-20' // Expiring Soon (within 30 days of Nov 2026)
      },
      {
        id: '3',
        name: 'Insulin Glargine',
        batchNumber: 'INS-303',
        category: 'Injection',
        price: 45.00,
        quantity: 25,
        mfgDate: '2024-05-01',
        expiryDate: '2026-10-15' // Expired (in the past)
      }
    ];
  });

  /**
   * WHY: Synchronize state with localStorage.
   * Whenever the `medicines` array changes (add, edit, delete), 
   * this useEffect automatically saves the fresh array to the browser.
   */
  useEffect(() => {
    localStorage.setItem('pharmacy_medicines', JSON.stringify(medicines));
  }, [medicines]);

  // --- CRUD HANDLER FUNCTIONS ---

  // 1. ADD: Creates a new medicine object with a unique timestamp ID
  const handleAddMedicine = (newMedicineData) => {
    const newMedicine = {
      id: Date.now().toString(), // Generates a unique string ID
      ...newMedicineData
    };
    setMedicines((prevMedicines) => [newMedicine, ...prevMedicines]);
  };

  // 2. UPDATE: Finds a medicine by ID and updates its fields
  const handleUpdateMedicine = (updatedMedicine) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) => (med.id === updatedMedicine.id ? updatedMedicine : med))
    );
  };

  // 3. DELETE: Removes a medicine by ID after confirmation
  const handleDeleteMedicine = (id) => {
    setMedicines((prevMedicines) => prevMedicines.filter((med) => med.id !== id));
  };

  return (
    <BrowserRouter>
      {/* Navbar stays visible on all pages */}
      <Navbar />

      {/* Main Container */}
      <div className="container py-4">
        <Routes>
          {/* Dashboard Route */}
          <Route path="/" element={<Dashboard medicines={medicines} />} />

          {/* Inventory Table Route with filters and search */}
          <Route 
            path="/inventory" 
            element={
              <InventoryPage 
                medicines={medicines} 
                onDelete={handleDeleteMedicine} 
              />
            } 
          />

          {/* Add Medicine Route */}
          <Route 
            path="/add" 
            element={<AddEditMedicine onSave={handleAddMedicine} medicines={medicines} />} 
          />

          {/* Edit Medicine Route (uses dynamic URL parameter :id) */}
          <Route 
            path="/edit/:id" 
            element={<AddEditMedicine onSave={handleUpdateMedicine} medicines={medicines} />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;