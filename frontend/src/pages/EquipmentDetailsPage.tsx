import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import LayoutBase from '../components/LayoutBase'
import { statusLabel, statusOptions, EQUIPMENT_STATUS } from '../types'
import type { ActionHistoryItem, Equipment, EquipmentStatus } from '../types'
import { useAuth } from '../state/AuthContext'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

export default function EquipmentDetailsPage() {
  const { id } = useParams()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [hist, setHist] = useState<ActionHistoryItem[]>([])
  const [actionType, setActionType] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const [toast, setToast] = useState<{ open: boolean; msg: string; color: 'success' | 'error' }>({ open: false, msg: '', color: 'success' })
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Equipment>(`/Equipments/${id}`)
        setEquipment(data)
        const h = await api.get<ActionHistoryItem[]>(`/Equipments/${id}/history`)
        setHist(h.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const chipColor = (s: EquipmentStatus): 'default' | 'success' | 'warning' | 'info' | 'error' => {
    switch (s) {
      case EQUIPMENT_STATUS.Available: return 'success'
      case EQUIPMENT_STATUS.InMaintenance: return 'warning'
      case EQUIPMENT_STATUS.Transferred: return 'info'
      case EQUIPMENT_STATUS.Discarded: return 'error'
      default: return 'default'
    }
  }

  async function addAction() {
    if (!id) {
      setToast({ open: true, msg: 'ID do equipamento inválido.', color: 'error' })
      return
    }
    if (!actionType && !notes) {
      setToast({ open: true, msg: 'Preencha pelo menos um campo.', color: 'error' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        performedBy: user?.nome || 'Admin',
        actionType: actionType.trim(),
        notes: notes.trim(),
      }
      await api.post(`/Equipments/${id}/action`, payload)
      const h = await api.get<ActionHistoryItem[]>(`/Equipments/${id}/history`)
      setHist(h.data)
      setActionType('')
      setNotes('')
      setToast({ open: true, msg: 'Ação registrada com sucesso!', color: 'success' })
    } catch (e: any) {
      const msg =
        e?.response?.data?.mensagem ||
        e?.response?.data?.title ||
        e?.message ||
        'Falha ao registrar ação.'
      setToast({ open: true, msg, color: 'error' })
      console.error('POST /action failed:', e?.response || e)
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(s: EquipmentStatus) {
    setSaving(true)
    try {
      await api.patch(`/Equipments/${id}/status/${s}`)
      const { data } = await api.get<Equipment>(`/Equipments/${id}`)
      setEquipment(data)
    } finally {
      setSaving(false)
    }
  }

  async function deleteEquipment() {
    if (!id) return
    if (!window.confirm('Tem certeza que deseja excluir este equipamento?')) return

    setSaving(true)
    try {
      await api.delete(`/Equipments/${id}`)
      setToast({ open: true, msg: 'Equipamento excluído com sucesso!', color: 'success' })
      navigate('/')
    } catch (e: any) {
      const msg =
        e?.response?.data?.mensagem ||
        e?.response?.data?.title ||
        e?.message ||
        'Falha ao excluir equipamento.'
      setToast({ open: true, msg, color: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !equipment) {
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
      <Box position="relative" mb={1}>
        <Button component={RouterLink} to="/" variant="text" sx={{ position: 'absolute', left: 0, top: 0 }}>
          ← Voltar
        </Button>
        <Typography variant="h5" align="center">Equipamento #{equipment.id}</Typography>
        <Box sx={{ position: 'absolute', right: 0, top: 0, display: 'flex', gap: 1 }}>
          <Button
            component={RouterLink}
            to={`/equipments/${equipment.id}/edit`}
            variant="outlined"
            size="small"
          >
            Editar
          </Button>
          <Button
            onClick={deleteEquipment}
            variant="outlined"
            color="error"
            size="small"
            disabled={saving}
            sx={{
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main',
              },
            }}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Stack spacing={1.2}>
            <Typography><b>Nome:</b> {equipment.name}</Typography>
            <Typography><b>Série:</b> {equipment.serialNumber}</Typography>
            <Typography>
              <b>Status:</b>{' '}
              <Chip size="small" color={chipColor(equipment.status)} label={statusLabel(equipment.status)} />
            </Typography>
            <Typography><b>Local:</b> {equipment.location}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Mudar status</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {statusOptions.map(o => (
              <Button
                key={o.value}
                size="small"
                variant={equipment.status === o.value ? 'contained' : 'outlined'}
                onClick={() => changeStatus(o.value)}
                disabled={saving}
              >
                {o.label}
              </Button>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Histórico</Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mb={2} alignItems="center" useFlexGap flexWrap="wrap">
        <TextField
          label="Tipo de ação"
          value={actionType}
          onChange={e => setActionType(e.target.value)}
          size="small"
        />
        <TextField
          label="Observações"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          size="small"
        />
        <Button
          onClick={addAction}
          variant="contained"
          disabled={saving}
          size="small"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Adicionar ação
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Por</TableCell>
            <TableCell>Ação</TableCell>
            <TableCell>Obs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hist.map(h => (
            <TableRow key={h.id} hover>
              <TableCell>{h.id}</TableCell>
              <TableCell>{new Date(h.actionDate).toLocaleString()}</TableCell>
              <TableCell>{h.performedBy}</TableCell>
              <TableCell>{h.actionType}</TableCell>
              <TableCell>{h.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast(s => ({ ...s, open: false }))}
        message={toast.msg}
      />
    </LayoutBase>
  )
}
