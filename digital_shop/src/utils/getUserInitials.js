export function getUserInitials(name) {
  if (!name) return '?'

  const parts = name.trim().split(' ').filter(Boolean)

  if (parts.length >= 2) {
    const last = parts[parts.length - 1][0]
    const secondLast = parts[parts.length - 2][0]
    return (last + secondLast).toUpperCase()
  }

  return parts[0].substring(0, 2).toUpperCase()
}
