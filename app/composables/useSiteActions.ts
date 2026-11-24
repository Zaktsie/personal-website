export const EMAIL = 'isaactsienyane@gmail.com'

export function useSiteActions() {
  const { toast } = useToast()
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast('Email address copied')
    }
    catch {
      toast(`Copy didn't work. The address is ${EMAIL}`)
    }
  }

  return { copyEmail }
}
