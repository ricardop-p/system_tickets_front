const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const decoded = atob(padded)

  return decodeURIComponent(
    Array.from(decoded)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

export const decodeJwt = (token) => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    return JSON.parse(decodeBase64Url(payload))
  } catch (error) {
    console.error('Token JWT invalido:', error)
    return null
  }
}

export const getRoleFromToken = (token) => {
  const payload = decodeJwt(token)
  if (!payload) return ''

  const role =
    payload.rol ||
    payload.role ||
    payload.tipo ||
    payload.tipo_usuario ||
    payload.user_type ||
    payload.perfil ||
    payload.user?.rol ||
    payload.user?.role ||
    payload.user?.tipo ||
    payload.user?.tipo_usuario ||
    ''

  return String(role).toLowerCase()
}

export const isAdminToken = (token) => {
  const role = getRoleFromToken(token)
  return role === 'admin' || role === 'administrador'
}
