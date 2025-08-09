export const EQUIPMENT_STATUS = {
  Available: 0,
  InMaintenance: 1,
  Transferred: 2,
  Discarded: 3,
} as const;

export type EquipmentStatus = typeof EQUIPMENT_STATUS[keyof typeof EQUIPMENT_STATUS];

export const statusOptions: { value: EquipmentStatus; label: string }[] = [
  { value: EQUIPMENT_STATUS.Available,      label: 'Disponível' },
  { value: EQUIPMENT_STATUS.InMaintenance,  label: 'Manutenção' },
  { value: EQUIPMENT_STATUS.Transferred,    label: 'Transferido' },
  { value: EQUIPMENT_STATUS.Discarded,      label: 'Descartado' },
];

export const statusLabel = (code: EquipmentStatus) =>
  statusOptions.find(o => o.value === code)?.label ?? String(code);

export type ActionHistoryItem = {
  id: number
  actionDate: string
  performedBy: string
  actionType: string
  notes: string
}

export type Equipment = {
  id: number
  name: string
  serialNumber: string
  description: string
  status: EquipmentStatus
  location: string
  createdAtUtc: string
  history?: ActionHistoryItem[]
}

export type EquipmentDto = {
  name: string
  serialNumber: string
  description: string
  status: EquipmentStatus
  location: string
}
