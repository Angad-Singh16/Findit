export const CATEGORIES = [
  { name: 'Electronics',  icon: '💻' },
  { name: 'ID Card',      icon: '🪪' },
  { name: 'Keys',         icon: '🔑' },
  { name: 'Bag',          icon: '🎒' },
  { name: 'Clothing',     icon: '👕' },
  { name: 'Water Bottle', icon: '🍶' },
  { name: 'Books',        icon: '📚' },
  { name: 'Wallet',       icon: '👜' },
  { name: 'Jewellery',    icon: '💍' },
  { name: 'Other',        icon: '📦' },
];

export const LOCATIONS = [
  'Library',
  'Cafeteria',
  'Main Gate',
  'Block A',
  'Block B',
  'Block C',
  'Sports Ground',
  'Parking Lot',
  'Hostel Block',
  'Admin Office',
  'Lab Building',
];

export const ITEM_STATUS = {
  open:     { label: 'Open',     color: 'bg-green-500/20 text-green-400' },
  claimed:  { label: 'Claimed',  color: 'bg-yellow-500/20 text-yellow-400' },
  resolved: { label: 'Resolved', color: 'bg-blue-500/20 text-blue-400' },
  expired:  { label: 'Expired',  color: 'bg-slate-500/20 text-slate-400' },
};

export const CLAIM_STATUS = {
  pending:  { label: 'Pending',  color: 'bg-yellow-500/20 text-yellow-400' },
  approved: { label: 'Approved', color: 'bg-green-500/20 text-green-400' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400' },
};