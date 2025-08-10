import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import LayoutBase from '../components/LayoutBase'
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material'
import logo from '../assets/icon.png'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@teste.com')
  const [password, setPassword] = useState('123')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    }
  }

  return (
    <LayoutBase cardMaxWidth="400px">
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo Tech Solutions"
          sx={{ height: 32 }}
        />
        <Typography variant="h5" color="primary">
          Tech Solutions
        </Typography>
      </Stack>

      <Box component="form" onSubmit={onSubmit} autoComplete="off">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          autoComplete="username"
        />

        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          autoComplete="current-password"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </Box>
      </Box>
    </LayoutBase>
  )
}
