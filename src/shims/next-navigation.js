export function useParams() {
  return null
}

export function usePathname() {
  if (typeof window === 'undefined') return ''
  return window.location.pathname
}

export function useSearchParams() {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

export default null
