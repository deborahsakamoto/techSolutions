import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

import { EQUIPMENT_STATUS, statusOptions } from '../types'
import type { EquipmentDto, EquipmentStatus } from '../types'

export default function EquipmentFormPage() {
  const [form, setForm] = useState<EquipmentDto>({
    name: '',
    serialNumber: '',
    description: '',
    status: EQUIPMENT_STATUS.Available,
    location: '',
  })

  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function update<K extends keyof EquipmentDto>(key: K, value: EquipmentDto[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/Equipments', form)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar')
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', fontFamily: 'system-ui' }}>
      <h2>Novo equipamento</h2>
      <form onSubmit={onSubmit}>
        <label>Nome</label>
        <input value={form.name} onChange={e => update('name', e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />

        <label>Número de Série</label>
        <input value={form.serialNumber} onChange={e => update('serialNumber', e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />

        <label>Descrição</label>
        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} style={{ width: '100%', padding: 8, marginBottom: 8 }} />

        <label>Status</label>
        <select
          value={form.status}
          onChange={e => update('status', Number(e.target.value) as EquipmentStatus)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <label>Local</label>
        <input value={form.location} onChange={e => update('location', e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />

        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
