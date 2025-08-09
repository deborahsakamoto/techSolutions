import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import { statusLabel, statusOptions } from '../types'
import type { ActionHistoryItem, Equipment, EquipmentStatus } from '../types'

export default function EquipmentDetailsPage() {
  const { id } = useParams()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [hist, setHist] = useState<ActionHistoryItem[]>([])
  const [actionType, setActionType] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Equipment>(`/Equipments/${id}`)
      setEquipment(data)
      const h = await api.get<ActionHistoryItem[]>(`/Equipments/${id}/history`)
      setHist(h.data)
    })()
  }, [id])

  async function addAction() {
    await api.post(`/Equipments/${id}/action`, {
      performedBy: 'Admin',
      actionType,
      notes,
    })
    const h = await api.get<ActionHistoryItem[]>(`/Equipments/${id}/history`)
    setHist(h.data)
    setActionType('')
    setNotes('')
  }

  async function changeStatus(s: EquipmentStatus) {
    await api.patch(`/Equipments/${id}/status/${s}`)
    const { data } = await api.get<Equipment>(`/Equipments/${id}`)
    setEquipment(data)
  }

  if (!equipment) return <p style={{ padding: 20 }}>Carregando…</p>

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', fontFamily: 'system-ui' }}>
      <Link to="/">← Voltar</Link>
      <h2>Equipamento #{equipment.id}</h2>
      <p><b>Nome:</b> {equipment.name}</p>
      <p><b>Série:</b> {equipment.serialNumber}</p>
      <p><b>Status:</b> {statusLabel(equipment.status)}</p>
      <p><b>Local:</b> {equipment.location}</p>

      <div style={{ margin: '16px 0' }}>
        <label>Mudar status: </label>
        {statusOptions.map(o => (
          <button key={o.value} onClick={() => changeStatus(o.value)} style={{ marginRight: 8 }}>
            {o.label}
          </button>
        ))}
      </div>

      <h3>Histórico</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Tipo de ação"
          value={actionType}
          onChange={e => setActionType(e.target.value)}
          style={{ marginRight: 8, padding: 6 }}
        />
        <input
          placeholder="Observações"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ marginRight: 8, padding: 6 }}
        />
        <button onClick={addAction}>Adicionar ação</button>
      </div>

      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Por</th>
            <th>Ação</th>
            <th>Obs</th>
          </tr>
        </thead>
        <tbody>
          {hist.map(h => (
            <tr key={h.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{h.id}</td>
              <td>{new Date(h.actionDate).toLocaleString()}</td>
              <td>{h.performedBy}</td>
              <td>{h.actionType}</td>
              <td>{h.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
