import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import '../App.css';
import { getMedicineStatus } from '../utils/expiryHelpers';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'expired', label: 'Expired' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
  { value: 'safe', label: 'Safe' },
];

const statusLabels = {
  expired: 'Expired',
  'expiring-soon': 'Expiring Soon',
  safe: 'Safe',
};

function InventoryPage({ medicines }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');

  const visibleMedicines = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return medicines
      .filter((medicine) => medicine.name.toLowerCase().includes(normalizedQuery))
      .filter(
        (medicine) =>
          activeFilter === 'all' ||
          getMedicineStatus(medicine.expiryDate) === activeFilter
      )
      .sort((first, second) => {
        const dateComparison = first.expiryDate.localeCompare(second.expiryDate);
        return sortDirection === 'asc' ? dateComparison : -dateComparison;
      });
  }, [medicines, searchQuery, activeFilter, sortDirection]);

  return (
    <section aria-labelledby="inventory-heading">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 id="inventory-heading" className="h2 fw-bold mb-1">
            Medicine Inventory
          </h1>
          <p className="text-secondary mb-0">
            Search, filter, and review medicine expiry status.
          </p>
        </div>
        <Link to="/add" className="btn btn-primary align-self-md-start">
          + Add Medicine
        </Link>
      </div>

      <div className="row g-3 align-items-end mb-3">
        <div className="col-12 col-lg-5">
          <label htmlFor="medicine-search" className="form-label fw-semibold">
            Search by medicine name
          </label>
          <input
            id="medicine-search"
            className="form-control"
            type="search"
            placeholder="Enter a medicine name"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="col-12 col-lg-7">
          <span className="form-label d-block fw-semibold">Expiry status</span>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filter by expiry status">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`btn ${
                  activeFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'
                }`}
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-2">
        <span className="text-secondary" aria-live="polite">
          Showing {visibleMedicines.length} of {medicines.length} medicines
        </span>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm align-self-start align-self-sm-auto"
          onClick={() =>
            setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
          }
          aria-label={`Sort by expiry date, ${
            sortDirection === 'asc' ? 'earliest first' : 'latest first'
          }`}
        >
          Sort by expiry date: {sortDirection === 'asc' ? 'Earliest first' : 'Latest first'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Medicine</th>
              <th scope="col">Batch number</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Manufacturing date</th>
              <th scope="col" aria-sort={sortDirection === 'asc' ? 'ascending' : 'descending'}>
                Expiry date
              </th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleMedicines.length > 0 ? (
              visibleMedicines.map((medicine) => {
                const status = getMedicineStatus(medicine.expiryDate);

                return (
                  <tr key={medicine.id} className={`table-${status}`}>
                    <th scope="row">{medicine.name}</th>
                    <td>{medicine.batchNumber}</td>
                    <td>{medicine.category}</td>
                    <td>{Number(medicine.price).toFixed(2)}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.mfgDate}</td>
                    <td>{medicine.expiryDate}</td>
                    <td>{statusLabels[status]}</td>
                    <td>
                      <Link
                        to={`/edit/${medicine.id}`}
                        className="btn btn-sm btn-outline-primary"
                        aria-label={`Edit ${medicine.name}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-secondary py-4">
                  {medicines.length === 0
                    ? 'No medicines have been added yet.'
                    : 'No medicines match your search and filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default InventoryPage;
