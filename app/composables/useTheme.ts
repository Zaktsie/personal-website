export type ThemeChoice = 'system' | 'light' | 'dark'

const ORDER: ThemeChoice[] = ['system', 'light', 'dark']

export function useTheme() {
  const choice = useState<ThemeChoice>('theme-choice', () => 'system')

  function apply(next: ThemeChoice) {
    choice.value = next
    const root = document.documentElement
    if (next === 'system') delete root.dataset.theme
    else root.dataset.theme = next
    try {
      if (next === 'system') localStorage.removeItem('theme')
      else localStorage.setItem('theme', next)
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
  }

  function cycle() {
    apply(ORDER[(ORDER.indexOf(choice.value) + 1) % ORDER.length]!)
  }

  onMounted(() => {
    const t = document.documentElement.dataset.theme
    choice.value = t === 'light' || t === 'dark' ? t : 'system'
  })

  return { choice, cycle }
}
