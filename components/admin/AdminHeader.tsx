type Props = {
  title: string
  action?: React.ReactNode
}

export default function AdminHeader({ title, action }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border)',
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}
