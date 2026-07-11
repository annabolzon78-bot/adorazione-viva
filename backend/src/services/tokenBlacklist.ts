/**
 * Token blacklist in memoria — sostituire con Redis in produzione.
 * Valido per la durata del processo (server restart la svuota).
 */
const blacklist = new Set<string>()

// Pulizia ogni ora per evitare memory leak (in prod: usa TTL Redis)
setInterval(() => {
  if (blacklist.size > 10000) {
    const arr = [...blacklist]
    arr.splice(0, 5000).forEach(t => blacklist.delete(t))
  }
}, 3600 * 1000)

export const tokenBlacklist = {
  add:       (token: string) => blacklist.add(token),
  has:       (token: string) => blacklist.has(token),
  delete:    (token: string) => blacklist.delete(token),
  size:      () => blacklist.size,
}
