import { useState } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/client.js'

const USERNAME_RE = /^[a-zA-Z0-9_]+$/

export default function AuthPage({ onAuth, resolved, onToggleTheme }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const validate = () => {
    const u = username.trim()
    if (u.length < 3) return 'Kullanıcı adı en az 3 karakter olmalı.'
    if (u.length > 30) return 'Kullanıcı adı en fazla 30 karakter olabilir.'
    if (!USERNAME_RE.test(u)) return 'Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir.'
    if (isRegister && password.length < 6) return 'Şifre en az 6 karakter olmalı.'
    if (!password) return 'Şifre zorunlu.'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) { setError(v); return }
    setSubmitting(true)
    setError(null)
    try {
      const u = username.trim()
      const result = isRegister ? await apiRegister(u, password) : await apiLogin(u, password)
      onAuth(result)
    } catch (err) {
      setError(err.message || 'Bir hata oluştu, lütfen tekrar dene.')
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setError(null)
  }

  return (
    <div className="auth-wrap">
      <button className="auth-theme" onClick={onToggleTheme} aria-label="Temayı değiştir">
        <span className="theme-knob" style={{ left: resolved === 'dark' ? '24px' : '2px' }} />
      </button>

      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-dot" />
          <span className="brand-name">Kitaplık</span>
        </div>
        <h1 className="auth-title">{isRegister ? 'Hesap oluştur' : 'Tekrar hoş geldin'}</h1>
        <p className="auth-sub">
          {isRegister
            ? 'Kişisel kütüphaneni oluşturmak için bir kullanıcı adı seç.'
            : 'Kütüphanene erişmek için giriş yap.'}
        </p>

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <label className="auth-field">
            <span className="auth-label">Kullanıcı adı</span>
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullanici_adi"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="Kullanıcı adı"
            />
          </label>
          <label className="auth-field">
            <span className="auth-label">Şifre</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              aria-label="Şifre"
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn-primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Lütfen bekle…' : isRegister ? 'Kayıt ol' : 'Giriş yap'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}{' '}
          <button type="button" className="auth-link" onClick={switchMode}>
            {isRegister ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </div>
      </div>
    </div>
  )
}
