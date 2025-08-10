import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import api from '../services/api'
import LayoutBase from '../components/LayoutBase'
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material'
import { statusOptions } from '../types'
import type { EquipmentDto, EquipmentStatus } from '../types'

export default function EquipmentFormPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<EquipmentDto>({
    name: '',
    serialNumber: '',
    description: '',
    status: statusOptions[0].value,
    location: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof EquipmentDto>(key: K, value: EquipmentDto[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await api.post('/Equipments', form)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <LayoutBase cardMaxWidth="600px">
      <Box position="relative" mb={1}>
        <Button
          component={RouterLink}
          to="/"
          variant="text"
          sx={{ position: 'absolute', left: 0, top: 0 }}
        >
          ← Voltar
        </Button>
        <Typography variant="h5" align="center">
          Novo equipamento
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSubmit} autoComplete="off" sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Número de série"
            value={form.serialNumber}
            onChange={(e) => update('serialNumber', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Descrição"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ '& .MuiInputBase-inputMultiline': { resize: 'none' } }}
          />

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={form.status as number}
              onChange={(e) => update('status', Number(e.target.value) as EquipmentStatus)}
            >
              {statusOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Local"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            fullWidth
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={saving}>
              Salvar
            </Button>
          </Box>
        </Stack>
      </Box>
    </LayoutBase>
  )
}
