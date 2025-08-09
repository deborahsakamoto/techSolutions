import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { statusLabel } from '../types'
import type { Equipment } from '../types'
import { useAuth } from '../state/AuthContext'

export default function EquipmentListPage() {
  const [items, setItems] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Equipment[]>('/Equipments')
        setItems(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p style={{ padding: 20 }}>Carregando…</p>

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Equipamentos</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user?.nome}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <div style={{ margin: '12px 0' }}>
        <Link to="/equipments/new">+ Novo equipamento</Link>
      </div>

      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>Série</th>
            <th>Status</th>
            <th>Local</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.serialNumber}</td>
              <td>{e.status}</td>
              <td>{e.location}</td>
              <td><Link to={`/equipments/${e.id}`}>Detalhes</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
