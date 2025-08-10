import React from 'react'

type LayoutBaseProps = {
  children: React.ReactNode
  cardMaxWidth?: string
}

export default function LayoutBase({ children, cardMaxWidth = '800px' }: LayoutBaseProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3)), url("/src/assets/background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: cardMaxWidth
      }}>
        {children}
      </div>
    </div>
  )
}
