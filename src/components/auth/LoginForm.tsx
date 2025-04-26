'use client';

export function LoginForm() {
  return (
    <form style={{ marginTop: 'var(--spacing-6)' }}>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>Email</label>
        <input 
          type="email" 
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)'
          }}
        />
      </div>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>Password</label>
        <input 
          type="password" 
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)'
          }}
        />
      </div>
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: 'var(--spacing-2)',
          backgroundColor: 'var(--foreground)',
          color: 'var(--background)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        Sign in
      </button>
    </form>
  );
} 