import { Link } from 'react-router';
import DashboardCards from '../Components/DashboardCards';

function Dashboard({ medicines }) {
  return (
    <div className="py-4">
      {/* Welcome Banner */}
      <div className="p-5 mb-5 bg-white rounded-3 shadow-sm border">
        <div className="container-fluid py-2">
          <h1 className="display-5 fw-bold text-primary">Pharmacy Inventory System</h1>
          <p className="col-md-8 fs-5 text-secondary mt-2">
            Welcome back! Monitor stock levels, track expiring medications, and manage your pharmacy catalog efficiently in real-time.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/inventory" className="btn btn-primary px-4 py-2">
              View Full Inventory
            </Link>
            <Link to="/add" className="btn btn-outline-secondary px-4 py-2">
              + Add New Medicine
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <h3 className="h4 fw-bold mb-3">Inventory Overview</h3>
      <DashboardCards medicines={medicines} />
    </div>
  );
}

export default Dashboard;