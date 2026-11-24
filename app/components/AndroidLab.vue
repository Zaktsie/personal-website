<script setup lang="ts">
// Interactive recreations of features I shipped on MiWay's Blink app.
const tabs = [
  { id: 'perms', label: 'Runtime permissions', kind: 'Android' },
  { id: 'maint', label: 'Live maintenance mode', kind: 'Frontend' },
  { id: 'push', label: 'Push and deep links', kind: 'Android' },
  { id: 'telematics', label: 'Telematics plugin', kind: 'Native bridge' },
] as const
type TabId = (typeof tabs)[number]['id']
const tab = ref<TabId>('perms')

/* ---------- Runtime permissions ---------- */
const versions = [9, 10, 11, 12, 13] as const
type V = (typeof versions)[number]
const version = ref<V>(13)
const step = ref<'idle' | 'location' | 'notify' | 'done'>('idle')
const precise = ref(true)
const log = ref<string[]>([])

const locationOptions = computed(() => {
  if (version.value === 9) return ['Allow', 'Deny']
  if (version.value === 10) return ['Allow all the time', 'Allow only while using the app', 'Deny']
  return ['While using the app', 'Only this time', 'Don\'t allow']
})
const apiLevel: Record<V, number> = { 9: 28, 10: 29, 11: 30, 12: 31, 13: 33 }

function startPerms() {
  log.value = [`Android ${version.value} (API ${apiLevel[version.value]})`]
  step.value = version.value >= 13 ? 'notify' : 'location'
}
function answerNotify(allow: boolean) {
  log.value.push(allow ? 'POST_NOTIFICATIONS granted' : 'POST_NOTIFICATIONS denied: fall back to in-app inbox')
  step.value = 'location'
}
function answerLocation(choice: string) {
  const denied = /deny|don't/i.test(choice)
  const scope = version.value >= 12 && !denied ? (precise.value ? 'precise' : 'approximate') : ''
  log.value.push(denied
    ? 'Location denied: show rationale screen, then deep link to settings'
    : `Location granted (${choice.toLowerCase()}${scope ? `, ${scope}` : ''})`)
  if (!denied && version.value >= 11 && choice !== 'Allow all the time') log.value.push('Background location: ask separately in system settings')
  step.value = 'done'
}
watch(version, () => { step.value = 'idle'; log.value = [] })

const permsCode = computed(() => version.value >= 13
  ? `if (Build.VERSION.SDK_INT >= 33) {
  launcher.launch(new String[] { POST_NOTIFICATIONS });
}
launcher.launch(new String[] {
  ACCESS_FINE_LOCATION,
  ACCESS_COARSE_LOCATION, // lets the user pick approximate
});`
  : version.value >= 11
    ? `// API 30+: background location is a separate,
// settings-only grant. Ask for foreground first.
launcher.launch(new String[] {
  ACCESS_FINE_LOCATION,
  ACCESS_COARSE_LOCATION,
});`
    : `ActivityCompat.requestPermissions(this,
  new String[] { ACCESS_FINE_LOCATION },
  REQ_LOCATION);`)

/* ---------- Maintenance mode ---------- */
const maintenance = ref(false)
const message = ref('Back by 14:00')
const maintCode = `// Nuxt route middleware: reacts to Firebase in real time
export default defineNuxtRouteMiddleware(() => {
  const { enabled } = useMaintenanceFlag() // onValue(ref(db, 'maintenance'))
  if (enabled.value) return navigateTo('/maintenance')
})`

/* ---------- Push + deep links ---------- */
const provider = ref<'fcm' | 'hms'>('fcm')
const notification = ref<null | { provider: string }>(null)
const screen = ref<'home' | 'claim'>('home')
function sendPush() {
  screen.value = 'home'
  notification.value = null
  setTimeout(() => (notification.value = { provider: provider.value === 'fcm' ? 'Firebase Cloud Messaging' : 'Huawei Push Kit' }), 250)
}
function openNotification() {
  notification.value = null
  screen.value = 'claim'
}
const pushCode = computed(() => provider.value === 'fcm'
  ? `// Google devices
FirebaseMessaging.getInstance().getToken()
  .addOnSuccessListener(token -> api.register(token, "fcm"));`
  : `// Huawei devices (no Google Play services)
String token = HmsInstanceId.getInstance(ctx)
  .getToken(appId, "HCM");
api.register(token, "hms");`)
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2" role="tablist" aria-label="Live demos">
      <button
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        :aria-controls="`panel-${t.id}`"
        class="flex items-center gap-2 rounded-full py-2.5 pr-5 pl-2.5 font-semibold transition-colors"
        :class="tab === t.id ? 'bg-ink text-bg' : 'bg-surface-1 hover:bg-surface-2'"
        @click="tab = t.id"
      >
        <span class="rounded-full px-2.5 py-0.5 text-xs" :class="t.kind === 'Android' ? 'bg-[#3ddc84] text-[#073b1f]' : t.kind === 'Native bridge' ? 'bg-amber text-[#3d2600]' : 'bg-primary-container text-on-primary-container'">{{ t.kind }}</span>
        {{ t.label }}
      </button>
    </div>

    <div class="mt-6 overflow-hidden rounded-[2.5rem] bg-band text-white">
      <!-- Permissions -->
      <div v-if="tab === 'perms'" id="panel-perms" role="tabpanel" aria-labelledby="tab-perms" class="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div class="min-w-0">
          <h3 class="text-3xl font-extrabold tracking-[-0.02em]">Every Android version asks differently</h3>
          <p class="mt-3 max-w-[56ch] text-lg text-white/80">I led the permission flows for Blink on Android 9 to 13 (and iOS). Each release changed the rules, so the app has to ask in the right order and recover gracefully when people say no. Pick a version and try it.</p>
          <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Android version">
            <button v-for="v in versions" :key="v" type="button" class="rounded-full px-4 py-2 font-bold" :class="version === v ? 'bg-[#3ddc84] text-[#073b1f]' : 'bg-white/10 hover:bg-white/20'" :aria-pressed="version === v" @click="version = v">Android {{ v }}</button>
          </div>
          <ol class="mt-6 min-h-24 space-y-1.5 font-mono text-sm text-white/85" aria-live="polite">
            <li v-for="(l, i) in log" :key="i" class="flex gap-2"><span class="text-[#3ddc84]" aria-hidden="true">›</span>{{ l }}</li>
            <li v-if="!log.length" class="text-white/50">Press "Find a towing service" on the phone to start.</li>
          </ol>
          <pre class="mt-4 overflow-x-auto rounded-2xl bg-black/30 p-4 text-[0.82rem] leading-relaxed text-white/90"><code>{{ permsCode }}</code></pre>
        </div>

        <DemoPhone label="Android permission demo">
          <div class="flex h-full flex-col p-4 pt-6">
            <p class="text-lg font-extrabold">Roadside help</p>
            <p class="text-xs text-[#4d5676]">We'll send help to where you are.</p>
            <div class="mt-4 h-32 rounded-2xl bg-[#dde3f9] [background-image:linear-gradient(#cfd6ee_1px,transparent_1px),linear-gradient(90deg,#cfd6ee_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true">
              <div v-if="step === 'done' && log.some(l => l.startsWith('Location granted'))" class="mx-auto mt-12 size-4 animate-ping rounded-full bg-[#2141d0]" />
            </div>
            <button type="button" class="mt-auto rounded-full bg-[#2141d0] py-2.5 text-sm font-bold text-white" @click="startPerms">Find a towing service</button>
          </div>

          <!-- System dialog -->
          <div v-if="step === 'notify' || step === 'location'" class="absolute inset-0 grid place-items-center bg-black/45 p-3">
            <div class="w-full rounded-[1.6rem] bg-white p-5 text-center text-[#111936] shadow-xl" role="alertdialog" aria-label="System permission dialog">
              <svg class="mx-auto size-6 text-[#2141d0]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path v-if="step === 'notify'" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.9V4a1 1 0 1 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1z" />
                <path v-else d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <p class="mt-3 text-[0.95rem] leading-snug">
                <template v-if="step === 'notify'">Allow <b>Blink</b> to send you notifications?</template>
                <template v-else>Allow <b>Blink</b> to access this device's location?</template>
              </p>
              <div v-if="step === 'location' && version >= 12" class="mt-3 grid grid-cols-2 gap-2 text-xs" role="radiogroup" aria-label="Location accuracy">
                <button type="button" role="radio" :aria-checked="precise" class="rounded-xl border-2 p-2" :class="precise ? 'border-[#2141d0] bg-[#dbe2ff]' : 'border-transparent bg-[#f3f5fc]'" @click="precise = true">Precise</button>
                <button type="button" role="radio" :aria-checked="!precise" class="rounded-xl border-2 p-2" :class="!precise ? 'border-[#2141d0] bg-[#dbe2ff]' : 'border-transparent bg-[#f3f5fc]'" @click="precise = false">Approximate</button>
              </div>
              <div class="mt-4 space-y-1.5" :class="{ 'flex justify-end gap-4 space-y-0': version === 9 && step === 'location' }">
                <template v-if="step === 'notify'">
                  <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerNotify(true)">Allow</button>
                  <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerNotify(false)">Don't allow</button>
                </template>
                <template v-else>
                  <button
                    v-for="o in locationOptions"
                    :key="o"
                    type="button"
                    class="text-sm font-semibold"
                    :class="version === 9 ? 'text-[#2141d0] uppercase' : 'block w-full rounded-full bg-[#dbe2ff] py-2 text-[#0c1a63]'"
                    @click="answerLocation(o)"
                  >{{ o }}</button>
                </template>
              </div>
            </div>
          </div>
        </DemoPhone>
      </div>

      <!-- Maintenance -->
      <div v-else-if="tab === 'maint'" id="panel-maint" role="tabpanel" aria-labelledby="tab-maint" class="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div class="min-w-0">
          <h3 class="text-3xl font-extrabold tracking-[-0.02em]">Switch the whole app into maintenance, live</h3>
          <p class="mt-3 max-w-[56ch] text-lg text-white/80">I built Blink's maintenance mode on Firebase Realtime Database, with a Nuxt middleware layer for disabling, redirecting and scheduling routes. Ops flips one flag and every open app reacts instantly, with no refresh. Try it.</p>

          <!-- Firebase-console-style data tree -->
          <div class="mt-6 rounded-2xl bg-black/30 p-5 font-mono text-sm">
            <p class="text-white/60">blink-app-default-rtdb</p>
            <div class="mt-2 border-l border-white/20 pl-4">
              <p>maintenance</p>
              <div class="mt-2 space-y-3 border-l border-white/20 pl-4">
                <label class="flex items-center gap-3">
                  <span>enabled:</span>
                  <button type="button" role="switch" :aria-checked="maintenance" class="relative h-6 w-11 rounded-full transition-colors" :class="maintenance ? 'bg-amber' : 'bg-white/25'" @click="maintenance = !maintenance">
                    <span class="absolute top-1 left-1 size-4 rounded-full bg-white transition-transform" :class="{ 'translate-x-5': maintenance }" />
                  </button>
                  <span :class="maintenance ? 'text-amber' : 'text-white/60'">{{ maintenance }}</span>
                </label>
                <label class="flex flex-wrap items-center gap-3">
                  <span>message:</span>
                  <input v-model="message" maxlength="40" class="min-w-0 flex-1 rounded-lg bg-white/10 px-2 py-1 text-white outline-none focus:ring-2 focus:ring-amber">
                </label>
              </div>
            </div>
          </div>
          <pre class="mt-4 overflow-x-auto rounded-2xl bg-black/30 p-4 text-[0.82rem] leading-relaxed text-white/90"><code>{{ maintCode }}</code></pre>
        </div>

        <DemoPhone label="Maintenance mode demo">
          <Transition name="fade" mode="out-in">
            <div v-if="!maintenance" key="app" class="flex h-full flex-col gap-3 p-4 pt-6">
              <p class="text-lg font-extrabold">Hi Zak</p>
              <div class="rounded-2xl bg-[#2141d0] p-4 text-white">
                <p class="text-xs opacity-80">Car cover</p>
                <p class="text-lg font-extrabold">Active</p>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                <span class="rounded-2xl bg-[#ffe2b8] p-3 text-[#3d2600]">Claims</span>
                <span class="rounded-2xl bg-[#ffd9ec] p-3 text-[#5c0033]">Roadside</span>
                <span class="rounded-2xl bg-[#dde3f9] p-3">Documents</span>
                <span class="rounded-2xl bg-[#dde3f9] p-3">Rewards</span>
              </div>
            </div>
            <div v-else key="m" class="flex h-full flex-col items-center justify-center gap-3 bg-[#0f1a3d] p-6 text-center text-white">
              <svg class="size-12 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z" /></svg>
              <p class="text-lg font-extrabold">We're tuning things up</p>
              <p class="text-sm text-white/80">{{ message || 'Back soon' }}</p>
            </div>
          </Transition>
        </DemoPhone>
      </div>

      <!-- Telematics -->
      <div v-else-if="tab === 'telematics'" id="panel-telematics" role="tabpanel" aria-labelledby="tab-telematics">
        <TelematicsDemo />
      </div>

      <!-- Push -->
      <div v-else id="panel-push" role="tabpanel" aria-labelledby="tab-push" class="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div class="min-w-0">
          <h3 class="text-3xl font-extrabold tracking-[-0.02em]">One push, two ecosystems, the right screen</h3>
          <p class="mt-3 max-w-[56ch] text-lg text-white/80">Huawei phones ship without Google services, so I integrated Huawei Push Kit alongside Firebase and built the redirection logic that opens the right screen when a notification is tapped. Pick a provider, send a push, then tap it.</p>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <div class="flex rounded-full bg-white/10 p-1" role="group" aria-label="Push provider">
              <button type="button" class="rounded-full px-4 py-2 font-bold" :class="provider === 'fcm' ? 'bg-white text-band' : ''" :aria-pressed="provider === 'fcm'" @click="provider = 'fcm'">Google (FCM)</button>
              <button type="button" class="rounded-full px-4 py-2 font-bold" :class="provider === 'hms' ? 'bg-white text-band' : ''" :aria-pressed="provider === 'hms'" @click="provider = 'hms'">Huawei (HMS)</button>
            </div>
            <button type="button" class="rounded-full bg-amber px-5 py-2.5 font-bold text-[#3d2600] active:scale-95" @click="sendPush">Send a push</button>
          </div>
          <pre class="mt-6 overflow-x-auto rounded-2xl bg-black/30 p-4 text-[0.82rem] leading-relaxed text-white/90"><code>{{ pushCode }}</code></pre>
        </div>

        <DemoPhone label="Push notification demo" dark>
          <div v-if="screen === 'home'" class="flex h-full flex-col items-center justify-center p-6 text-center text-white/70">
            <p class="text-4xl font-semibold text-white">9:41</p>
            <p class="mt-1 text-sm">Locked</p>
          </div>
          <div v-else class="flex h-full flex-col gap-3 bg-[#f3f5fc] p-4 pt-6 text-[#111936]">
            <button type="button" class="self-start text-sm font-semibold text-[#2141d0]" @click="screen = 'home'">Back</button>
            <p class="text-xs text-[#4d5676]">Opened from a notification</p>
            <p class="text-xl font-extrabold">Claim CL-20418</p>
            <ol class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-[#0f8a6b]" />Submitted</li>
              <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-[#0f8a6b]" />Assessor assigned</li>
              <li class="flex items-center gap-2 font-bold"><span class="size-2.5 rounded-full bg-amber" />Repair approved</li>
            </ol>
          </div>
          <Transition name="fade">
            <button
              v-if="notification"
              type="button"
              class="absolute inset-x-2 top-1 z-20 rounded-[1.4rem] bg-white p-3 text-left text-[#111936] shadow-xl"
              @click="openNotification"
            >
              <span class="flex items-center gap-2 text-[11px] text-[#4d5676]">
                <span class="grid size-4 place-items-center rounded-full bg-[#2141d0] text-[8px] font-bold text-white">B</span>
                Blink, via {{ notification.provider }}
              </span>
              <span class="mt-1 block text-sm font-bold">Your repair was approved</span>
              <span class="block text-xs text-[#4d5676]">Tap to see claim CL-20418</span>
            </button>
          </Transition>
        </DemoPhone>
      </div>
    </div>
    <p class="mt-3 text-sm text-muted">Simplified recreations of work I shipped at MiWay. The production code isn't public.</p>
  </div>
</template>
