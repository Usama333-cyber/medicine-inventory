import { getMedicineStatus } from '../utils/expiryHelpers';

function DashboardCards({ medicines }) {
  // --- CALCULATE SUMMARY METRICS ---
  const totalMedicines = medicines.length;

  // Count expired items using our helper from expiryHelpers.js
  const expiredCount = medicines.filter(
    (med) => getMedicineStatus(med.expiryDate) === 'expired'
  ).length;

  // Count expiring soon items (within 30 days)
  const expiringSoonCount = medicines.filter(
    (med) => getMedicineStatus(med.expiryDate) === 'expiring-soon'
  ).length;

  // Count low stock items (Bonus requirement: quantity < 10)
  const lowStockCount = medicines.filter(
    (med) => Number(med.quantity) < 10
  ).length;

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-5">
      {/* Card 1: Total Medicines */}
      <div className="col">
        <div className="card stat-card border-0 shadow-sm bg-light h-100">
          <div className="card-body">
            <h6 className="text-muted text-uppercase fw-semibold fs-7">Total Medicines</h6>
            <h2 className="display-6 fw-bold text-dark mt-2 mb-0">{totalMedicines}</h2>
          </div>
        </div>
      </div>

      {/* Card 2: Expired */}
      <div className="col">
        <div className="card stat-card border-0 shadow-sm bg-danger bg-opacity-10 h-100 border-start border-danger border-4">
          <div className="card-body">
            <h6 className="text-danger text-uppercase fw-semibold fs-7">Expired Items</h6>
            <h2 className="display-6 fw-bold text-danger mt-2 mb-0">{expiredCount}</h2>
          </div>
        </div>
      </div>

      {/* Card 3: Expiring Soon */}
      <div className="col">
        <div className="card stat-card border-0 shadow-sm bg-warning bg-opacity-10 h-100 border-start border-warning border-4">
          <div className="card-body">
            <h6 className="text-warning text-dark text-uppercase fw-semibold fs-7">Expiring Soon (30d)</h6>
            <h2 className="display-6 fw-bold text-warning text-dark mt-2 mb-0">{expiringSoonCount}</h2>
          </div>
        </div>
      </div>

      {/* Card 4: Low Stock */}
      <div className="col">
        <div className="card stat-card border-0 shadow-sm bg-info bg-opacity-10 h-100 border-start border-info border-4">
          <div className="card-body">
            <h6 className="text-info text-dark text-uppercase fw-semibold fs-7">Low Stock (&lt; 10)</h6>
            <h2 className="display-6 fw-bold text-info text-dark mt-2 mb-0">{lowStockCount}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;