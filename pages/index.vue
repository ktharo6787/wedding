<script setup lang="ts">
import { invitation as invitationDefaults } from '~/data/invitation'

const route = useRoute()
const weddingSlug = computed(() => String(route.query.wedding || '').trim())
const { data: managedConfig } = await useFetch<any>('/api/public/config', { query: { wedding: weddingSlug } })
const invitation = reactive(structuredClone(invitationDefaults))
const theme = reactive<any>({
  background: '#0c422f',
  panel: '#082923',
  gold: '#dfbd75',
  text: '#f2e6c9',
  muted: '#d6c9ac',
  backgroundImage: '/images/interior-background.jpg',
  openingCrestImage: '/images/gold-khmer-emblem-cutout.png',
  heroEmblemImage: '/images/gold-wedding-monogram.png',
  butterflyImage: '/images/animated-butterfly.png',
  frameImage: '',
  fontStyle: 'classic',
  animations: true,
  butterflies: true,
  content: {
    openingEyebrow: 'A WEDDING INVITATION',
    announcement: "WE'RE GETTING MARRIED",
    invitationMessage: 'Request the Honor of Your Presence on the Auspicious Occasion of the Wedding Reception of Our Children',
    programmeSubtitle: 'We look forward to sharing each beautiful moment with you.',
    detailsSubtitle: 'Everything you need for our special day.',
    giftsSubtitle: 'Your presence is our most precious gift.',
    rsvpSubtitle: 'Please respond by {deadline}.',
    footerMessage: 'We cannot wait to celebrate with you.'
  }
})

watchEffect(() => {
  if (!managedConfig.value) return
  const updatedInvitation = managedConfig.value.invitation || {}
  Object.assign(invitation, updatedInvitation)
  Object.assign(invitation.couple, updatedInvitation.couple || {})
  if (updatedInvitation.parents) {
    invitation.parents.groom = updatedInvitation.parents.groom || invitation.parents.groom
    invitation.parents.bride = updatedInvitation.parents.bride || invitation.parents.bride
  }
  Object.assign(theme, managedConfig.value.theme || {})
  Object.assign(theme.content, managedConfig.value.theme?.content || {})
})

const opened = ref(false)
const playing = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const pageRoot = ref<HTMLElement | null>(null)
const now = ref<number | null>(null)
const guestName = ref('')
const activeProgramme = ref<'ceremony' | 'reception'>('ceremony')
const giftOpened = ref(false)
const submitted = ref(false)
const copied = ref(false)
const rsvpSaving = ref(false)
const rsvpError = ref('')
const inviteCode = computed(() => String(route.query.invite || '').trim())
const rsvp = reactive({ name: '', attending: 'yes', guests: '1', note: '' })
let ticker: ReturnType<typeof setInterval> | undefined
let revealObserver: IntersectionObserver | undefined

const programmes = {
  ceremony: [
    { time: '6:00 AM', symbol: '✧', title: 'ពិធីសែនព្រេន', detail: 'ការរៀបចំពិធីតាមប្រពៃណីខ្មែរ' },
    { time: '7:00 AM', symbol: '♧', title: 'ពិធីហែជំនូន', detail: 'ស្វាគមន៍ក្រុមគ្រួសារ និងភ្ញៀវកិត្តិយស' },
    { time: '8:00 AM', symbol: '❀', title: 'ពិធីសូត្រមន្ត', detail: 'ទទួលពរជ័យសម្រាប់គូស្វាមីភរិយា' },
    { time: '8:45 AM', symbol: '◈', title: 'ពិធីប្រពៃណី', detail: 'ប្រារព្ធពិធីដ៏មានអត្ថន័យជាមួយក្រុមគ្រួសារ' },
    { time: '9:00 AM', symbol: '✂︎', title: 'ពិធីកាត់សក់', detail: 'ពិធីតាមទំនៀមទម្លាប់ខ្មែរ' },
    { time: '10:30 AM', symbol: '∞', title: 'ពិធីចងដៃ', detail: 'ពិធីចងដៃ និងទទួលពរជ័យពីក្រុមគ្រួសារ និងភ្ញៀវកិត្តិយស' },
    { time: '11:30 AM', symbol: '♡', title: 'ថតរូបអនុស្សាវរីយ៍', detail: 'ចងចាំពេលវេលាដ៏ស្រស់ស្អាតជាមួយគ្នា' },
    { time: '5:00 PM', symbol: '♫', title: 'ទទួលភ្ញៀវពេលល្ងាច', detail: 'អញ្ជើញចូលរួមអបអរសាទរ និងពិសាអាហារពេលល្ងាច' }
  ],
  reception: [
    { time: '5:00 PM', symbol: '✧', title: 'ស្វាគមន៍ភ្ញៀវ', detail: 'ទទួលភ្ញៀវ និងថតរូបអនុស្សាវរីយ៍' },
    { time: '6:00 PM', symbol: '❀', title: 'ពិសាអាហារពេលល្ងាច', detail: 'ចែករំលែកអាហារ និងសេចក្តីរីករាយ' },
    { time: '7:00 PM', symbol: '♫', title: 'អបអរសាទរគូស្វាមីភរិយា', detail: 'តន្ត្រី ការជូនពរ និងការរាំកម្សាន្ត' }
  ]
}

const dateParts = computed(() => {
  const [year, monthNumber, day] = invitation.date.slice(0, 10).split('-')
  const date = new Date(`${year}-${monthNumber}-${day}T00:00:00Z`)
  return {
    year,
    monthNumber,
    day,
    month: new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(date).toUpperCase(),
    weekday: new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: 'UTC' }).format(date).toUpperCase()
  }
})
const dateDisplay = computed(() => `${dateParts.value.day} · ${dateParts.value.month} · ${dateParts.value.year}`)
const rsvpSubtitle = computed(() => String(theme.content.rsvpSubtitle || '').replace('{deadline}', invitation.rsvpDeadline))
const safeBackgroundImage = computed(() => String(theme.backgroundImage || '/images/interior-background.jpg').replace(/[\"'()]/g, ''))
const safeButterflyImage = computed(() => String(theme.butterflyImage || '/images/animated-butterfly.png').replace(/[\"'()]/g, ''))
const themeStyles = computed(() => ({
  '--theme-background': theme.background,
  '--theme-panel': theme.panel,
  '--theme-gold': theme.gold,
  '--theme-text': theme.text,
  '--theme-muted': theme.muted,
  '--theme-background-image': `url("${safeBackgroundImage.value}")`,
  '--theme-butterfly-image': `url("${safeButterflyImage.value}")`
}))

const countdown = computed(() => {
  if (now.value === null) return null
  const remaining = Math.max(0, new Date(invitation.date).getTime() - now.value)
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  }
})
const mapUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venueAddress)}`)
const calendarUrl = computed(() => {
  const start = new Date(invitation.date)
  const end = new Date(invitation.calendarEnd)
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding of ${invitation.couple.first} & ${invitation.couple.second}`,
    dates: `${format(start)}/${format(end)}`,
    stz: 'Asia/Phnom_Penh',
    etz: 'Asia/Phnom_Penh',
    details: invitation.venueAddress ? 'We look forward to celebrating with you.' : 'We look forward to celebrating with you. Venue details to follow.'
  })
  if (invitation.venueAddress) params.set('location', invitation.venueAddress)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
})
const rsvpText = computed(() => [
  `RSVP for ${invitation.couple.first} & ${invitation.couple.second}`,
  `Name: ${rsvp.name}`,
  `Attending: ${rsvp.attending === 'yes' ? 'Yes' : 'No'}`,
  `Guests: ${rsvp.attending === 'yes' ? rsvp.guests : '0'}`,
  `Message: ${rsvp.note || 'None'}`
].join('\n'))

function openInvitation() {
  opened.value = true
  document.body.style.overflow = ''
  window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 650)
}

async function toggleMusic() {
  if (!audio.value) return
  if (playing.value) {
    audio.value.pause()
    playing.value = false
    return
  }
  try {
    await audio.value.play()
    playing.value = true
  } catch {
    playing.value = false
  }
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

async function copyRsvp() {
  try {
    copied.value = await copyText(rsvpText.value)
  } catch {
    copied.value = false
  }
}

async function submitRsvp() {
  rsvpSaving.value = true
  rsvpError.value = ''
  try {
    await $fetch('/api/public/rsvp', {
      method: 'POST',
      body: {
        inviteCode: inviteCode.value,
        weddingSlug: managedConfig.value?.project?.slug || weddingSlug.value,
        ...rsvp
      }
    })
    submitted.value = true
  } catch (error: any) {
    rsvpError.value = error?.data?.statusMessage || 'Unable to save your response. Please try again.'
  } finally {
    rsvpSaving.value = false
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  now.value = Date.now()
  ticker = setInterval(() => { now.value = Date.now() }, 1000)
  if (inviteCode.value) {
    $fetch<any>(`/api/public/invite/${encodeURIComponent(inviteCode.value)}`, { query: { wedding: managedConfig.value?.project?.slug || weddingSlug.value } }).then((guest) => {
      guestName.value = guest.name || ''
      rsvp.name = guest.name || ''
      rsvp.attending = guest.status === 'declined' ? 'no' : 'yes'
      rsvp.guests = String(guest.attendingCount || guest.partySize || 1)
    }).catch(() => undefined)
  }
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pageRoot.value?.classList.add('has-motion')
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          revealObserver?.unobserve(entry.target)
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' })
    pageRoot.value?.querySelectorAll('[data-reveal]').forEach((element) => revealObserver?.observe(element))
  }
})
onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
  revealObserver?.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <main ref="pageRoot" class="wedding-app" :class="{ 'invitation-open': opened, 'theme-no-motion': !theme.animations, 'theme-no-butterflies': !theme.butterflies, [`theme-font-${theme.fontStyle}`]: true }" :style="themeStyles">
    <div class="opening-screen" :class="{ 'is-open': opened }">
      <div class="opening-door opening-door-left"></div><div class="opening-door opening-door-right"></div>
      <div class="opening-content">
        <div class="opening-heading">
          <p class="opening-eyebrow">{{ theme.content.openingEyebrow }}</p>
          <h1 lang="km">{{ invitation.couple.first }} <i>&</i> {{ invitation.couple.second }}</h1>
          <p class="opening-script">With love, we invite you to celebrate</p>
        </div>
        <button class="opening-crest" type="button" aria-label="Open the wedding invitation" @click="openInvitation">
          <img :src="theme.openingCrestImage" alt="">
        </button>
        <div class="opening-lower">
          <label class="guest-label" for="guest-name">INVITED GUEST</label>
          <div class="guest-name-wrap">
            <span class="guest-name-measure" aria-hidden="true">{{ guestName || 'Invited guest' }}</span>
            <input id="guest-name" v-model.trim="guestName" class="guest-input" maxlength="60" placeholder="Invited guest" autocomplete="name" readonly aria-readonly="true">
          </div>
          <p class="opening-date">{{ dateDisplay }}</p>
          <p class="opening-date-khmer" lang="km">ថ្ងៃអាទិត្យ ទី០៦ ខែធ្នូ ឆ្នាំ២០២៦ វេលាម៉ោង ៥:០០ ល្ងាច<br>ស្ថិតនៅ មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍ អន្តរជាតិ<br>(ជ្រោយចង្វារ) OCIC (អគារ A)</p>
        </div>
      </div>
    </div>

    <audio ref="audio" :src="invitation.musicFile" loop preload="none" @ended="playing = false"></audio>
    <button v-if="opened" class="music-control" type="button" :aria-label="playing ? 'Pause music' : 'Play music'" :aria-pressed="playing" @click="toggleMusic">{{ playing ? '♫' : '♪' }}</button>
    <div v-if="opened && theme.butterflies" class="butterfly-layer" aria-hidden="true">
      <span class="butterfly butterfly-one"></span>
      <span class="butterfly butterfly-two"></span>
      <span class="butterfly butterfly-three"></span>
      <span class="butterfly butterfly-four"></span>
      <span class="butterfly butterfly-five"></span>
    </div>

    <section id="home" class="hero emerald-section" data-reveal>
      <div class="hero-inner invitation-sheet ornament-frame">
        <img class="khmer-title-emblem" :src="theme.heroEmblemImage" alt="Wedding monogram">
        <img v-if="theme.frameImage" class="custom-frame-overlay" :src="theme.frameImage" alt="" aria-hidden="true">
        <div class="hero-copy text-only-invitation">
          <p v-if="guestName" class="guest-greeting">DEAR {{ guestName.toUpperCase() }},</p>
          <p class="khmer invitation-heading" lang="km">សិរីសួស្តីអាពាហ៍ពិពាហ៍</p>
          <div class="parent-columns" aria-label="Parents of the groom and bride">
            <div class="parent-family">
              <span class="khmer parent-family-label" lang="km">មាតាបិតាកូនប្រុស</span>
              <p v-for="parent in invitation.parents.groom" :key="parent" class="khmer parent-name" lang="km">{{ parent }}</p>
            </div>
            <div class="parent-family">
              <span class="khmer parent-family-label" lang="km">មាតាបិតាកូនស្រី</span>
              <p v-for="parent in invitation.parents.bride" :key="parent" class="khmer parent-name" lang="km">{{ parent }}</p>
            </div>
          </div>
          <p class="khmer invitation-heading" lang="km">មានកិត្តិយស សូមគោរពអញ្ជើញ</p>
          <p class="khmer hero-message" lang="km">ឯកឧត្តម លោកជំទាវ លោកឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា ប្រិយមិត្តអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ សិរីមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍
                                                  កូនប្រុស កូនស្រី របស់យើងខ្ញុំ។</p>
          <div class="khmer couple-roles" lang="km"><span>កូនប្រុសនាម</span><span>កូនស្រីនាម</span></div>
          <h2 class="couple-names english-couple-names"><span>{{ invitation.couple.groomEnglish }}</span><em>ជាគូនឹង</em><span>{{ invitation.couple.brideEnglish }}</span></h2>
          <p class="wedding-title">{{ theme.content.announcement }}</p>
          <div class="gold-divider"><span>✦</span></div>
          <p class="english-message">{{ theme.content.invitationMessage }}</p>
          <div class="date-plaque"><strong>{{ dateParts.day }}</strong><span>{{ dateParts.month }}<br>{{ dateParts.year }}</span><small>{{ dateParts.weekday }}</small></div>
          <div class="khmer event-details-khmer" lang="km">
            <p v-for="line in invitation.khmerEventDetails" :key="line">{{ line }}</p>
          </div>
          <a class="text-link" href="#programme">EXPLORE THE INVITATION <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>

    <section id="programme" class="content-section programme-section emerald-section" data-reveal>
      <SectionDivider />
      <div class="section-heading"><span class="micro-label">THE WEDDING PROGRAMME</span><p class="khmer" lang="km">{{ activeProgramme === 'ceremony' ? 'ពិធីមង្គលការ' : 'ទទួលភ្ញៀវ' }}</p><h2>{{ activeProgramme === 'ceremony' ? 'Ceremony' : 'Reception' }}</h2><p class="section-subtitle">{{ theme.content.programmeSubtitle }}</p></div>
      <div class="programme-card ornament-frame">
        <div class="segment-control" aria-label="Programme"><button type="button" :class="{ active: activeProgramme === 'ceremony' }" :aria-pressed="activeProgramme === 'ceremony'" @click="activeProgramme = 'ceremony'">CEREMONY</button><button type="button" :class="{ active: activeProgramme === 'reception' }" :aria-pressed="activeProgramme === 'reception'" @click="activeProgramme = 'reception'">RECEPTION</button></div>
        <Transition name="programme" mode="out-in"><ol :key="activeProgramme" class="programme-list"><li v-for="item in programmes[activeProgramme]" :key="item.time"><span class="programme-icon" aria-hidden="true">{{ item.symbol }}</span><span class="programme-point" aria-hidden="true">✦</span><div><time>{{ item.time }}</time><h3 class="khmer" lang="km">{{ item.title }}</h3><p class="khmer" lang="km">{{ item.detail }}</p></div></li></ol></Transition>
        <p class="programme-footnote">The programme is a guide; please confirm ritual wording and times before sharing.</p>
      </div>
    </section>

    <section id="details" class="content-section details-section emerald-section" data-reveal>
      <SectionDivider />
      <div class="section-heading"><span class="micro-label">THE ESSENTIALS</span><p class="khmer" lang="km">ព័ត៌មានសំខាន់ៗ</p><h2>Wedding Details</h2><p class="section-subtitle">{{ theme.content.detailsSubtitle }}</p></div>
      <div class="details-grid">
        <article class="detail-card ornament-frame"><span class="detail-icon" aria-hidden="true">◇</span><span class="micro-label">THE DATE</span><h3>{{ invitation.dateLabel }}</h3><p>Ceremony at {{ invitation.ceremonyTime }}<br>Reception at {{ invitation.receptionTime }}</p><a class="outline-button" :href="calendarUrl" target="_blank" rel="noopener noreferrer" aria-label="Open wedding event in Google Calendar">ADD TO GOOGLE CALENDAR ↗</a></article>
        <article class="detail-card ornament-frame"><span class="detail-icon" aria-hidden="true">⌖</span><span class="micro-label">THE VENUE</span><h3>{{ invitation.venue }}</h3><p>{{ invitation.venueLocation }}<template v-if="invitation.venueAddress"><br>{{ invitation.venueAddress }}</template></p><a v-if="invitation.venueAddress" class="outline-button" :href="mapUrl" target="_blank" rel="noopener noreferrer">OPEN MAP ↗</a><span v-else class="detail-note">Location details coming soon</span></article>
        <article class="detail-card dress-detail ornament-frame"><span class="detail-icon" aria-hidden="true">✧</span><span class="micro-label">DRESS CODE</span><h3>{{ invitation.dressCode }}</h3><p>Dress for a joyful celebration.</p><div class="palette" aria-label="Suggested elegant color palette"><span></span><span></span><span></span><span></span></div></article>
      </div>
    </section>

    <section id="gifts" class="content-section gifts-section emerald-section" data-reveal>
      <SectionDivider />
      <div class="section-heading"><span class="micro-label">WITH ALL OUR HEARTS</span><p class="khmer" lang="km">ចំណងដៃ</p><h2>A Note on Gifts</h2><p class="section-subtitle">{{ theme.content.giftsSubtitle }}</p></div>
      <div class="gift-envelope-wrap"><button class="gift-envelope" :class="{ 'is-open': giftOpened }" type="button" :aria-expanded="giftOpened" aria-controls="gift-message" @click="giftOpened = !giftOpened"><span class="gift-envelope-paper" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="gift-envelope-body" aria-hidden="true"></span><span class="gift-envelope-flap" aria-hidden="true"></span><span class="gift-envelope-seal">{{ invitation.couple.initials }}</span></button><p class="gift-hint">{{ giftOpened ? 'A MESSAGE FROM US' : 'TAP THE ENVELOPE' }}</p><Transition name="gift"><div v-if="giftOpened" id="gift-message" class="gift-message"><span class="gift-message-kicker">A NOTE FOR YOU</span><p>Your presence is the most precious gift. If you wish to give more, a wishing well will be available at our celebration.</p><span class="gift-message-signoff">WITH LOVE, {{ invitation.couple.first.toUpperCase() }} & {{ invitation.couple.second.toUpperCase() }}</span></div></Transition></div>
    </section>

    <section id="rsvp" class="content-section rsvp-section emerald-section" data-reveal>
      <SectionDivider />
      <div class="section-heading"><span class="micro-label">WE HOPE YOU CAN JOIN US</span><p class="khmer" lang="km">សូមឆ្លើយតប</p><h2>Kindly Reply</h2><p class="section-subtitle">{{ rsvpSubtitle }}</p></div>
      <div class="rsvp-card ornament-frame">
        <form v-if="!submitted" class="rsvp-form" @submit.prevent="submitRsvp"><label>YOUR NAME<input v-model.trim="rsvp.name" type="text" name="name" autocomplete="name" required placeholder="Full name"></label><fieldset><legend>WILL YOU ATTEND?</legend><label><input v-model="rsvp.attending" type="radio" value="yes"> Joyfully accepts</label><label><input v-model="rsvp.attending" type="radio" value="no"> Regretfully declines</label></fieldset><label v-if="rsvp.attending === 'yes'">NUMBER OF GUESTS<select v-model="rsvp.guests"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 guests</option><option value="6">ច្រើនជាង 6 guests</option></select></label><label>A MESSAGE FOR US<textarea v-model="rsvp.note" rows="3" placeholder="Your wishes or a note..."></textarea></label><p v-if="rsvpError" class="rsvp-error">{{ rsvpError }}</p><button class="gold-button" type="submit" :disabled="rsvpSaving">{{ rsvpSaving ? 'SAVING…' : 'SEND RSVP' }} <span aria-hidden="true">↗</span></button></form>
        <div v-else class="rsvp-result" role="status"><h3>Thank you</h3><p>Your RSVP has been saved for the couple.</p><pre>{{ rsvpText }}</pre><button class="gold-button" type="button" @click="copyRsvp">{{ copied ? 'COPIED' : 'COPY RESPONSE' }}</button><button class="text-link" type="button" @click="submitted = false">EDIT RESPONSE</button></div>
      </div>
    </section>

    <section class="content-section letter-section emerald-section" data-reveal aria-label="សេចក្តីថ្លែងអំណរគុណ">
      <SectionDivider />
      <div class="letter-card ornament-frame">
        <div class="letter-block">
          <h2 class="khmer" lang="km">លិខិតថ្លែងអំណរគុណ!</h2>
          <p class="khmer" lang="km">ខ្ញុំបាទ នាងខ្ញុំជាម្ចាស់កម្មវិធី
                                     សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះ
                                     វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់ឯកឧត្តម លោកជំទាវ
                                     លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក
                                     លោកស្រី អ្នកនាង កញ្ញា ដែលអញ្ជើញចូលរួម
                                     ជាភ្ញៀវកិត្តិយសក្នុងកម្មវិធីរបស់យើងខ្ញុំ។
                                     សូមមេត្តាទទួលនូវការគោរពដ៏ខ្ពង់ខ្ពស់
                                     របស់គ្រួសារយើងខ្ញុំ។</p>
        </div>
        <div class="letter-block">
          <h2 class="khmer" lang="km">លិខិតសូមអភ័យទោស</h2>
          <p class="khmer" lang="km">ខ្ញុំបាទ នាងខ្ញុំជាម្ចាស់កម្មវិធី
                                     សូមមេត្តាខន្តីអភ័យទោសពីសំណាក់ឯកឧត្តម
                                     លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា
                                     លោក លោកស្រី អ្នកនាង កញ្ញា និងភ្ញៀវកិត្តិយស
                                     ទាំងអស់ដោយយើងខ្ញុំពុំបានជូនលិខិតអញ្ជើញ
                                     ដោយផ្ទាល់ដៃ ឬចំពោះកំហុសអក្ខរាវិរុទ្ធក្នុង
                                     ការសរសេរឈ្មោះ។ សូមមេត្តាយោគយល់
                                     និងសូមគោរពអរគុណទុកជាមុន។</p>
        </div>
      </div>
    </section>

    <footer class="emerald-section" data-reveal><p class="khmer" lang="km">សូមអរគុណ</p><strong class="khmer" lang="km">{{ invitation.couple.first }} <i>&</i> {{ invitation.couple.second }}</strong><span>{{ dateDisplay }}</span><p>{{ theme.content.footerMessage }}</p></footer>
    <nav v-if="opened" class="bottom-nav" aria-label="Invitation sections"><a href="#home"><span aria-hidden="true">⌂</span><small>HOME</small></a><a href="#programme"><span aria-hidden="true">▦</span><small>PROGRAM</small></a><a href="#details"><span aria-hidden="true">⌖</span><small>DETAILS</small></a><a href="#gifts"><span aria-hidden="true">◇</span><small>GIFTS</small></a><a href="#rsvp"><span aria-hidden="true">♡</span><small>RSVP</small></a></nav>
  </main>
</template>
