<script setup lang="ts">
// Simplified recreation of the MiWay telematics plugin: a JS API backed by
// native Android (Java) and iOS (Swift) code. Visitors call the JS methods;
// the phone shows what the native side does; the log shows the bridge traffic.
type Platform = 'android' | 'ios'
type Phase = 'idle' | 'location' | 'background' | 'activity' | 'ready' | 'onboarding' | 'live'
type Line = { dir: 'js' | 'native' | 'event' | 'error', text: string }

const platform = ref<Platform>('android')
const phase = ref<Phase>('idle')
const location = ref<'denied' | 'while_in_use' | 'always' | null>(null)
const activity = ref<'granted' | 'denied' | null>(null)
const onboardStep = ref(0)
const tripActive = ref(false)
const log = ref<Line[]>([])
let timers: ReturnType<typeof setTimeout>[] = []

const onboardSteps = ['Initialising provider SDK', 'Registering this device', 'Linking your policy', 'Trip detection on']
const busy = computed(() => ['location', 'background', 'activity', 'onboarding'].includes(phase.value))

function reset() {
  timers.forEach(clearTimeout)
  timers = []
  phase.value = 'idle'
  location.value = null
  activity.value = null
  onboardStep.value = 0
  tripActive.value = false
  log.value = []
}
watch(platform, reset)
onBeforeUnmount(() => timers.forEach(clearTimeout))

function push(dir: Line['dir'], text: string) {
  log.value.push({ dir, text })
}

/* ---- Telematics.requestPermissions() ---- */
function requestPermissions() {
  if (busy.value) return
  location.value = null
  activity.value = null
  push('js', 'await Telematics.requestPermissions()')
  phase.value = 'location'
}

function answerLocation(granted: boolean) {
  if (!granted) {
    location.value = 'denied'
    finishPermissions()
    return
  }
  location.value = 'while_in_use'
  // Trips happen with the app closed, so we also need background ("always") location.
  phase.value = 'background'
}

function answerBackground(always: boolean) {
  location.value = always ? 'always' : 'while_in_use'
  phase.value = 'activity'
}

function answerActivity(granted: boolean) {
  activity.value = granted ? 'granted' : 'denied'
  finishPermissions()
}

function finishPermissions() {
  push('native', JSON.stringify({ location: location.value, activity: activity.value ?? 'not_asked' }))
  phase.value = 'ready'
}

/* ---- Telematics.onboardProvider() ---- */
function onboardProvider() {
  if (busy.value) return
  push('js', `await Telematics.onboardProvider({ id: 'sample-provider' })`)
  if (location.value !== 'always' || activity.value !== 'granted') {
    const code = location.value !== 'always' ? 'BACKGROUND_LOCATION_REQUIRED' : 'ACTIVITY_PERMISSION_REQUIRED'
    push('error', `rejected: ${code}. The app shows a guide to fix it in Settings.`)
    return
  }
  phase.value = 'onboarding'
  onboardStep.value = 0
  onboardSteps.forEach((_, i) => {
    timers.push(setTimeout(() => {
      onboardStep.value = i + 1
      if (i === onboardSteps.length - 1) {
        push('native', JSON.stringify({ provider: 'sample-provider', status: 'active' }))
        phase.value = 'live'
      }
    }, 600 * (i + 1)))
  })
}

/* ---- native -> JS events ---- */
function simulateTrip() {
  if (phase.value !== 'live') return
  tripActive.value = !tripActive.value
  push('event', tripActive.value
    ? `tripStarted ${JSON.stringify({ speedKmh: 62 })}`
    : `tripEnded ${JSON.stringify({ distanceKm: 14.2, score: 87 })}`)
}

const jsCode = `// One JS API for every app; native code does the rest
const perms = await Telematics.requestPermissions()
await Telematics.onboardProvider({ id: 'sample-provider' })

Telematics.addListener('tripStarted', showTripBanner)
Telematics.addListener('tripEnded', ({ score }) => saveScore(score))`

const nativeCode = computed(() => platform.value === 'android'
  ? `// Android (Java)
public void requestPermissions(PluginCall call) {
  List<String> perms = new ArrayList<>(List.of(ACCESS_FINE_LOCATION));
  if (Build.VERSION.SDK_INT >= 29) perms.add(ACTIVITY_RECOGNITION);
  requestAll(perms, granted -> {
    // Background location is a separate grant on API 29+
    if (granted) askForBackgroundLocation(call);
    else call.resolve(status());
  });
}`
  : `// iOS (Swift)
@objc func requestPermissions(_ call: PluginCall) {
  locationManager.requestWhenInUseAuthorization()
  onAuthorized { [weak self] in
    // Upgrade to Always so trips are detected in the background
    self?.locationManager.requestAlwaysAuthorization()
    self?.motion.queryActivityStarting(from: .now, to: .now, to: .main) { _, _ in
      call.resolve(self?.status() ?? [:])
    }
  }
}`)

const lineStyle: Record<Line['dir'], { mark: string, cls: string, sr: string }> = {
  js: { mark: 'JS', cls: 'bg-amber text-[#3d2600]', sr: 'JavaScript called' },
  native: { mark: platform.value === 'ios' ? 'iOS' : 'AND', cls: 'bg-[#3ddc84] text-[#073b1f]', sr: 'Native returned' },
  event: { mark: 'EVT', cls: 'bg-[#b3c2ff] text-[#0c1a63]', sr: 'Native event' },
  error: { mark: 'ERR', cls: 'bg-pink text-white', sr: 'Native rejected' },
}
const nativeMark = computed(() => (platform.value === 'ios' ? 'iOS' : 'AND'))
</script>

<template>
  <div class="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
    <div class="min-w-0">
      <h3 class="text-3xl font-extrabold tracking-[-0.02em]">One JavaScript API, two native platforms</h3>
      <p class="mt-3 max-w-[58ch] text-lg text-white/80">
        On the telematics team I architected the MiWay telematics plugin. Our JavaScript apps call one API; native Android (Java) and iOS (Swift) code handles the permissions, onboards telematics providers and streams trip events back. Run the calls in order and watch the bridge.
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-2">
        <div class="flex rounded-full bg-white/10 p-1" role="group" aria-label="Platform">
          <button type="button" class="rounded-full px-4 py-2 font-bold" :class="platform === 'android' ? 'bg-[#3ddc84] text-[#073b1f]' : ''" :aria-pressed="platform === 'android'" @click="platform = 'android'">Android</button>
          <button type="button" class="rounded-full px-4 py-2 font-bold" :class="platform === 'ios' ? 'bg-white text-band' : ''" :aria-pressed="platform === 'ios'" @click="platform = 'ios'">iOS</button>
        </div>
        <button type="button" class="rounded-full px-4 py-2 font-semibold text-white/70 hover:text-white" @click="reset">Reset</button>
      </div>

      <!-- The JS calls a web app would make -->
      <ol class="mt-5 space-y-2">
        <li>
          <button type="button" class="flex w-full items-center gap-3 rounded-2xl bg-white/8 p-3 text-left font-mono text-sm hover:bg-white/15 disabled:opacity-50" :disabled="busy" @click="requestPermissions">
            <span class="grid size-7 shrink-0 place-items-center rounded-full bg-white font-sans font-bold text-band">1</span>
            Telematics.requestPermissions()
          </button>
        </li>
        <li>
          <button type="button" class="flex w-full items-center gap-3 rounded-2xl bg-white/8 p-3 text-left font-mono text-sm hover:bg-white/15 disabled:opacity-50" :disabled="busy || phase === 'idle' || phase === 'live'" @click="onboardProvider">
            <span class="grid size-7 shrink-0 place-items-center rounded-full bg-white font-sans font-bold text-band">2</span>
            Telematics.onboardProvider({ id: 'sample-provider' })
          </button>
        </li>
        <li>
          <button type="button" class="flex w-full items-center gap-3 rounded-2xl bg-white/8 p-3 text-left font-mono text-sm hover:bg-white/15 disabled:opacity-50" :disabled="phase !== 'live'" @click="simulateTrip">
            <span class="grid size-7 shrink-0 place-items-center rounded-full bg-white font-sans font-bold text-band">3</span>
            {{ tripActive ? 'End the trip (native event)' : 'Start a trip (native event)' }}
          </button>
        </li>
      </ol>

      <!-- Bridge log -->
      <div class="mt-4 min-h-28 rounded-2xl bg-black/30 p-4 font-mono text-[0.8rem]" aria-live="polite">
        <p class="mb-2 font-sans text-sm font-semibold text-white/60">Bridge log</p>
        <p v-if="!log.length" class="text-white/45">Start with step 1.</p>
        <ol class="space-y-1.5">
          <li v-for="(l, i) in log" :key="i" class="flex items-start gap-2">
            <span class="mt-px shrink-0 rounded px-1.5 font-sans text-[0.65rem] font-bold" :class="lineStyle[l.dir].cls" aria-hidden="true">{{ l.dir === 'native' ? nativeMark : lineStyle[l.dir].mark }}</span>
            <span class="sr-only">{{ lineStyle[l.dir].sr }}:</span>
            <span class="break-all text-white/90">{{ l.text }}</span>
          </li>
        </ol>
      </div>

      <div class="mt-4 grid gap-3">
        <pre class="overflow-x-auto rounded-2xl bg-black/30 p-4 text-[0.78rem] leading-relaxed text-white/90"><code>{{ jsCode }}</code></pre>
        <pre class="overflow-x-auto rounded-2xl bg-black/30 p-4 text-[0.78rem] leading-relaxed text-white/90"><code>{{ nativeCode }}</code></pre>
      </div>
    </div>

    <DemoPhone :label="`Telematics plugin demo on ${platform === 'ios' ? 'iOS' : 'Android'}`">
      <!-- App screen -->
      <div class="flex h-full flex-col p-4 pt-6">
        <p class="text-lg font-extrabold">MiWay Drive</p>
        <p class="text-xs text-[#4d5676]">Safer driving, scored automatically.</p>

        <div v-if="phase === 'onboarding' || phase === 'live'" class="mt-4 space-y-2">
          <p v-for="(s, i) in onboardSteps" :key="s" class="flex items-center gap-2 text-xs" :class="i < onboardStep ? 'text-[#111936]' : 'text-[#4d5676]/60'">
            <span class="grid size-4 place-items-center rounded-full text-[9px] font-bold text-white" :class="i < onboardStep ? 'bg-[#0f8a6b]' : 'bg-[#cfd6ee]'">{{ i < onboardStep ? '✓' : '' }}</span>
            {{ s }}
          </p>
        </div>
        <div v-else class="mt-4 space-y-2 text-xs">
          <p class="flex justify-between rounded-xl bg-white p-2.5"><span>Location</span><b>{{ location ? location.replace(/_/g, ' ') : 'not asked' }}</b></p>
          <p class="flex justify-between rounded-xl bg-white p-2.5"><span>{{ platform === 'ios' ? 'Motion & Fitness' : 'Physical activity' }}</span><b>{{ activity ?? 'not asked' }}</b></p>
        </div>

        <div class="mt-auto rounded-2xl p-4 text-white transition-colors" :class="tripActive ? 'bg-[#0f8a6b]' : phase === 'live' ? 'bg-[#2141d0]' : 'bg-[#4d5676]'">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14M6 17l1.5-5h9L18 17M8 17v2M16 17v2M7.5 12 9 8h6l1.5 4" /></svg>
          <p class="mt-2 font-extrabold">{{ tripActive ? 'Trip in progress, 62 km/h' : phase === 'live' ? 'Telematics on' : 'Telematics off' }}</p>
          <p class="text-xs opacity-80">{{ tripActive ? 'Drive safe. Your score updates when you stop.' : phase === 'live' ? 'Trips are detected automatically.' : 'Grant permissions to get started.' }}</p>
        </div>
      </div>

      <!-- Native system prompts -->
      <div v-if="phase === 'location' || phase === 'background' || phase === 'activity'" class="absolute inset-0 grid place-items-center bg-black/45 p-3">
        <!-- Android -->
        <div v-if="platform === 'android'" class="w-full rounded-[1.6rem] bg-white p-5 text-center text-[#111936] shadow-xl" role="alertdialog" aria-label="Android permission dialog">
          <template v-if="phase === 'location'">
            <p class="text-[0.95rem] leading-snug">Allow <b>MiWay</b> to access this device's location?</p>
            <div class="mt-4 space-y-1.5">
              <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerLocation(true)">While using the app</button>
              <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerLocation(false)">Don't allow</button>
            </div>
          </template>
          <template v-else-if="phase === 'background'">
            <p class="text-xs text-[#4d5676]">Settings, App permissions, Location</p>
            <p class="mt-2 text-[0.95rem] leading-snug font-semibold">Location access for MiWay</p>
            <div class="mt-3 space-y-1.5 text-left text-sm">
              <button type="button" class="flex w-full items-center gap-2 rounded-xl p-2 hover:bg-[#f3f5fc]" @click="answerBackground(true)"><span class="size-4 rounded-full border-2 border-[#2141d0]" />Allow all the time</button>
              <button type="button" class="flex w-full items-center gap-2 rounded-xl p-2 hover:bg-[#f3f5fc]" @click="answerBackground(false)"><span class="size-4 rounded-full border-[5px] border-[#2141d0]" />Allow only while using the app</button>
            </div>
          </template>
          <template v-else>
            <p class="text-[0.95rem] leading-snug">Allow <b>MiWay</b> to access your physical activity?</p>
            <div class="mt-4 space-y-1.5">
              <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerActivity(true)">Allow</button>
              <button type="button" class="block w-full rounded-full bg-[#dbe2ff] py-2 text-sm font-semibold text-[#0c1a63]" @click="answerActivity(false)">Don't allow</button>
            </div>
          </template>
        </div>

        <!-- iOS -->
        <div v-else class="w-full overflow-hidden rounded-2xl bg-[#f2f2f7]/95 text-center text-[#111] shadow-xl backdrop-blur" role="alertdialog" aria-label="iOS permission alert">
          <div class="p-4">
            <p class="text-[0.9rem] leading-snug font-semibold">
              <template v-if="phase === 'location'">Allow "MiWay" to use your location?</template>
              <template v-else-if="phase === 'background'">Change to "Always Allow"?</template>
              <template v-else>"MiWay" would like to access your Motion &amp; Fitness activity</template>
            </p>
            <p class="mt-1 text-xs text-[#3c3c43]/80">
              {{ phase === 'activity' ? 'Used to tell when you are driving.' : 'Used to detect and score your trips.' }}
            </p>
          </div>
          <div class="divide-y divide-[#3c3c43]/20 border-t border-[#3c3c43]/20 text-[0.95rem] text-[#007aff]">
            <template v-if="phase === 'location'">
              <button type="button" class="block w-full py-2.5" @click="answerLocation(true)">Allow While Using App</button>
              <button type="button" class="block w-full py-2.5" @click="answerLocation(false)">Don't Allow</button>
            </template>
            <template v-else-if="phase === 'background'">
              <button type="button" class="block w-full py-2.5" @click="answerBackground(false)">Keep Only While Using</button>
              <button type="button" class="block w-full py-2.5 font-semibold" @click="answerBackground(true)">Change to Always Allow</button>
            </template>
            <template v-else>
              <button type="button" class="block w-full py-2.5" @click="answerActivity(false)">Don't Allow</button>
              <button type="button" class="block w-full py-2.5 font-semibold" @click="answerActivity(true)">OK</button>
            </template>
          </div>
        </div>
      </div>
    </DemoPhone>
  </div>
</template>
