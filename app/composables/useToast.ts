type Toast = { id: number, text: string }

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])
  function toast(text: string) {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, text }]
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 2800)
  }
  return { toasts, toast }
}
