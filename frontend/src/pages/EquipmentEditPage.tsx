import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import api from '../services/api'
import LayoutBase from '../components/LayoutBase'
import { statusOptions } from '../types'
import type { Equipment, EquipmentDto, EquipmentStatus } from '../types'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material'

export default function EquipmentEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<EquipmentDto>({
        name: '',
        serialNumber: '',
        description: '',
        status: statusOptions[0].value,
        location: '',
    })

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get<Equipment>(`/Equipments/${id}`)
                setForm({
                    name: data.name,
                    serialNumber: data.serialNumber,
                    description: data.description,
                    status: data.status,
                    location: data.location,
                })
            } finally {
                setLoading(false)
            }
        })()
    }, [id])

    function update<K extends keyof EquipmentDto>(key: K, value: EquipmentDto[K]) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSaving(true)
        try {
            await api.put(`/Equipments/${id}`, form)
            navigate(`/equipments/${id}`)
        } catch (err: any) {
            setError(err?.response?.data?.mensagem || 'Erro ao salvar alterações')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <LayoutBase cardMaxWidth="600px">
                <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
            </LayoutBase>
        )
    }

    return (
        <LayoutBase cardMaxWidth="600px">
            <Box position="relative" mb={1}>
                <Button component={RouterLink} to={`/equipments/${id}`} variant="text" sx={{ position: 'absolute', left: 0, top: 0 }}>
                    ← Voltar
                </Button>
                <Typography variant="h5" align="center">Editar equipamento #{id}</Typography>
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
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Local"
                        value={form.location}
                        onChange={(e) => update('location', e.target.value)}
                        fullWidth
                    />
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" disabled={saving}>Salvar alterações</Button>
                    </Box>
                </Stack>
            </Box>
        </LayoutBase>
    )
}
