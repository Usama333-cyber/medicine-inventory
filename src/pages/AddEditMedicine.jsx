import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

const emptyForm = {
  name: '',
  batchNumber: '',
  category: '',
  price: '',
  quantity: '',
  mfgDate: '',
  expiryDate: '',
};

function toFormValues(medicine) {
  if (!medicine) {
    return emptyForm;
  }

  return {
    name: medicine.name ?? '',
    batchNumber: medicine.batchNumber ?? '',
    category: medicine.category ?? '',
    price: medicine.price == null ? '' : String(medicine.price),
    quantity: medicine.quantity == null ? '' : String(medicine.quantity),
    mfgDate: medicine.mfgDate ?? '',
    expiryDate: medicine.expiryDate ?? '',
  };
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function AddEditMedicine({ onSave, medicines }) {
  const { id } = useParams();
  const medicineToEdit = medicines.find((medicine) => medicine.id === id);
  const isEditing = Boolean(id);

  if (isEditing && !medicineToEdit) {
    return (
      <section className="text-center py-5" aria-labelledby="medicine-not-found-heading">
        <h1 id="medicine-not-found-heading" className="h2">
          Medicine not found
        </h1>
        <p className="text-secondary">The medicine you are trying to edit does not exist.</p>
        <Link to="/inventory" className="btn btn-primary">
          Back to inventory
        </Link>
      </section>
    );
  }

  return (
    <MedicineForm
      key={id || 'new'}
      medicineId={id}
      medicine={medicineToEdit}
      onSave={onSave}
    />
  );
}

function MedicineForm({ medicineId, medicine, onSave }) {
  const navigate = useNavigate();
  const isEditing = Boolean(medicineId);
  const [formValues, setFormValues] = useState(() => toFormValues(medicine));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      if (name === 'mfgDate' || name === 'expiryDate') {
        delete nextErrors.expiryDate;
      }
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const requiredFields = [
      ['name', 'Medicine name'],
      ['batchNumber', 'Batch number'],
      ['category', 'Category'],
      ['price', 'Price'],
      ['quantity', 'Quantity'],
      ['mfgDate', 'Manufacturing date'],
      ['expiryDate', 'Expiry date'],
    ];

    requiredFields.forEach(([field, label]) => {
      if (String(formValues[field]).trim() === '') {
        nextErrors[field] = `${label} is required.`;
      }
    });

    if (formValues.price !== '') {
      const price = Number(formValues.price);
      if (!Number.isFinite(price) || price < 0) {
        nextErrors.price = 'Enter a valid price that is zero or greater.';
      }
    }

    if (formValues.quantity !== '') {
      const quantity = Number(formValues.quantity);
      if (!Number.isInteger(quantity) || quantity < 0) {
        nextErrors.quantity = 'Enter a whole-number quantity that is zero or greater.';
      }
    }

    const hasValidManufacturingDate = isValidDate(formValues.mfgDate);
    const hasValidExpiryDate = isValidDate(formValues.expiryDate);

    if (formValues.mfgDate && !hasValidManufacturingDate) {
      nextErrors.mfgDate = 'Enter a valid manufacturing date.';
    }
    if (formValues.expiryDate && !hasValidExpiryDate) {
      nextErrors.expiryDate = 'Enter a valid expiry date.';
    } else if (
      hasValidManufacturingDate &&
      hasValidExpiryDate &&
      formValues.expiryDate <= formValues.mfgDate
    ) {
      nextErrors.expiryDate = 'Expiry date must be after the manufacturing date.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      ...(isEditing ? { id: medicineId } : {}),
      name: formValues.name.trim(),
      batchNumber: formValues.batchNumber.trim(),
      category: formValues.category,
      price: Number(formValues.price),
      quantity: Number(formValues.quantity),
      mfgDate: formValues.mfgDate,
      expiryDate: formValues.expiryDate,
    });
    navigate('/inventory');
  };

  const fieldError = (field) =>
    errors[field] ? (
      <div id={`${field}-error`} className="invalid-feedback d-block">
        {errors[field]}
      </div>
    ) : null;

  return (
    <section aria-labelledby="medicine-form-heading" className="mx-auto" style={{ maxWidth: '760px' }}>
      <div className="mb-4">
        <h1 id="medicine-form-heading" className="h2 fw-bold">
          {isEditing ? 'Edit Medicine' : 'Add Medicine'}
        </h1>
        <p className="text-secondary mb-0">
          Enter the medicine details below. All fields are required.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger" role="alert">
          Please correct the highlighted fields before saving.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="name" className="form-label">
              Medicine name
            </label>
            <input
              id="name"
              name="name"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              value={formValues.name}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {fieldError('name')}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="batchNumber" className="form-label">
              Batch number
            </label>
            <input
              id="batchNumber"
              name="batchNumber"
              className={`form-control${errors.batchNumber ? ' is-invalid' : ''}`}
              value={formValues.batchNumber}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.batchNumber)}
              aria-describedby={errors.batchNumber ? 'batchNumber-error' : undefined}
            />
            {fieldError('batchNumber')}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className={`form-select${errors.category ? ' is-invalid' : ''}`}
              value={formValues.category}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select a category</option>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Capsule">Capsule</option>
              <option value="Other">Other</option>
            </select>
            {fieldError('category')}
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={`form-control${errors.price ? ' is-invalid' : ''}`}
              value={formValues.price}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? 'price-error' : undefined}
            />
            {fieldError('price')}
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="quantity" className="form-label">
              Quantity in stock
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              className={`form-control${errors.quantity ? ' is-invalid' : ''}`}
              value={formValues.quantity}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.quantity)}
              aria-describedby={errors.quantity ? 'quantity-error' : undefined}
            />
            {fieldError('quantity')}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="mfgDate" className="form-label">
              Manufacturing date
            </label>
            <input
              id="mfgDate"
              name="mfgDate"
              type="date"
              className={`form-control${errors.mfgDate ? ' is-invalid' : ''}`}
              value={formValues.mfgDate}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.mfgDate)}
              aria-describedby={errors.mfgDate ? 'mfgDate-error' : undefined}
            />
            {fieldError('mfgDate')}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="expiryDate" className="form-label">
              Expiry date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              min={formValues.mfgDate || undefined}
              className={`form-control${errors.expiryDate ? ' is-invalid' : ''}`}
              value={formValues.expiryDate}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.expiryDate)}
              aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
            />
            {fieldError('expiryDate')}
          </div>
        </div>

        <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
          <Link to="/inventory" className="btn btn-outline-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Medicine' : 'Save Medicine'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddEditMedicine;
