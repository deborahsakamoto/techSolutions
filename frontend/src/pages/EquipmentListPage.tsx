import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import api from '../services/api'
import LayoutBase from '../components/LayoutBase'
import { useAuth } from '../state/AuthContext'
import type { Equipment } from '../types'
import { statusLabel } from '../types'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

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

  if (loading) {
    return (
      <LayoutBase cardMaxWidth="1000px">
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      </LayoutBase>
    )
  }

  return (
    <LayoutBase cardMaxWidth="1000px">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Equipamentos</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {user?.nome}
          </Typography>
          <Button variant="outlined" onClick={logout}>Sair</Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box mb={2}>
        <Button
          component={RouterLink}
          to="/equipments/new"
          variant="contained"
        >
          + Novo equipamento
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Série</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Local</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(e => (
            <TableRow key={e.id} hover>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.serialNumber}</TableCell>
              <TableCell>{statusLabel(e.status)}</TableCell>
              <TableCell>{e.location}</TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  to={`/equipments/${e.id}`}
                  size="small"
                  variant="text"
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </LayoutBase>
  )
}
