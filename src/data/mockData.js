// Stage 1 mock data — Demo Supermart (PRD Section 36 + 37).
// In-memory only. No database, no monitoring rules, no AI.

export const business = {
  id: 'biz-001',
  name: 'Demo Supermart',
  type: 'Supermarket',
  location: 'Lagos, Nigeria',
  owner: 'Adaeze Okafor',
  contact: '0803 000 1234',
  hours: '8:00 AM - 9:00 PM',
}

export const users = [
  { id: 'user-owner', name: 'Adaeze Okafor', role: 'Business Owner', businessId: 'biz-001' },
  { id: 'user-manager', name: 'Tunde Bello', role: 'Authorized Manager', businessId: 'biz-001' },
  { id: 'user-staff', name: 'Chiamaka Eze', role: 'Staff User', businessId: 'biz-001' },
]

// Six demo products from the PRD.
export const products = [
  { id: 'prod-rice', name: 'Rice', category: 'Grains', price: 85000, stock: 42, expectedStock: 42 },
  { id: 'prod-oil', name: 'Cooking Oil', category: 'Grocery', price: 12000, stock: 60, expectedStock: 60 },
  { id: 'prod-milk', name: 'Milk', category: 'Dairy', price: 3500, stock: 80, expectedStock: 80 },
  { id: 'prod-bread', name: 'Bread', category: 'Bakery', price: 1500, stock: 50, expectedStock: 48 },
  { id: 'prod-sugar', name: 'Sugar', category: 'Grocery', price: 5000, stock: 70, expectedStock: 70 },
  { id: 'prod-detergent', name: 'Detergent', category: 'Household', price: 6500, stock: 55, expectedStock: 55 },
]

// Sample normal + unusual transactions for later stages.
// Stage 1 only displays them. No alert generation here.
export const transactions = [
  { id: 'txn-001', date: '2026-09-18 09:12', type: 'sale', productId: 'prod-bread', quantity: 2, amount: 3000, staffId: 'user-staff', discount: 0 },
  { id: 'txn-002', date: '2026-09-18 10:05', type: 'sale', productId: 'prod-milk', quantity: 4, amount: 14000, staffId: 'user-staff', discount: 0 },
  { id: 'txn-003', date: '2026-09-18 11:20', type: 'sale', productId: 'prod-rice', quantity: 1, amount: 85000, staffId: 'user-manager', discount: 0 },
  { id: 'txn-004', date: '2026-09-18 12:15', type: 'discount', productId: 'prod-oil', quantity: 2, amount: 21600, staffId: 'user-staff', discount: 10 },
  { id: 'txn-005', date: '2026-09-18 13:40', type: 'sale', productId: 'prod-sugar', quantity: 3, amount: 15000, staffId: 'user-staff', discount: 0 },
  { id: 'txn-006', date: '2026-09-18 14:02', type: 'refund', productId: 'prod-milk', quantity: 1, amount: 3500, staffId: 'user-manager', discount: 0 },
  { id: 'txn-007', date: '2026-09-18 14:20', type: 'refund', productId: 'prod-bread', quantity: 2, amount: 3000, staffId: 'user-manager', discount: 0 },
  { id: 'txn-008', date: '2026-09-19 09:30', type: 'sale', productId: 'prod-detergent', quantity: 5, amount: 32500, staffId: 'user-staff', discount: 0 },
  { id: 'txn-009', date: '2026-09-19 10:12', type: 'sale', productId: 'prod-rice', quantity: 7, amount: 595000, staffId: 'user-staff', discount: 0 },
  { id: 'txn-010', date: '2026-09-19 11:00', type: 'sale', productId: 'prod-oil', quantity: 1, amount: 12000, staffId: 'user-staff', discount: 0 },
  { id: 'txn-011', date: '2026-09-19 11:25', type: 'discount', productId: 'prod-sugar', quantity: 4, amount: 16000, staffId: 'user-manager', discount: 20 },
  { id: 'txn-012', date: '2026-09-19 12:05', type: 'sale', productId: 'prod-milk', quantity: 6, amount: 21000, staffId: 'user-staff', discount: 0 },
]
