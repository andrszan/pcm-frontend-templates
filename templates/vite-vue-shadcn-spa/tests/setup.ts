import { afterEach } from 'vitest'

const values = new Map<string, string>()

type MediaState = {
  matches: boolean
  listeners: Set<EventListenerOrEventListenerObject>
  legacyListeners: Set<(this: MediaQueryList, event: MediaQueryListEvent) => void>
  list: MediaQueryList
}

const mediaStates = new Map<string, MediaState>()

function createMediaState(query: string): MediaState {
  const listeners = new Set<EventListenerOrEventListenerObject>()
  const legacyListeners = new Set<(this: MediaQueryList, event: MediaQueryListEvent) => void>()
  const state = {} as MediaState
  const list: MediaQueryList = {
    get matches() {
      return state.matches
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (listener) listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (listener) listeners.delete(listener)
    },
    addListener: (listener) => {
      if (listener) legacyListeners.add(listener)
    },
    removeListener: (listener) => {
      if (listener) legacyListeners.delete(listener)
    },
    dispatchEvent: (event) => {
      for (const listener of listeners) {
        if (typeof listener === 'function') listener.call(list, event)
        else listener.handleEvent(event)
      }
      for (const listener of legacyListeners) listener.call(list, event as MediaQueryListEvent)
      list.onchange?.call(list, event as MediaQueryListEvent)
      return true
    },
  }
  Object.assign(state, { matches: false, listeners, legacyListeners, list })
  return state
}

function mediaState(query: string) {
  const existing = mediaStates.get(query)
  if (existing) return existing
  const created = createMediaState(query)
  mediaStates.set(query, created)
  return created
}

export function setMediaQuery(query: string, matches: boolean) {
  const state = mediaState(query)
  state.matches = matches
  const event = Object.assign(new Event('change'), { matches, media: query })
  state.list.dispatchEvent(event)
}

export function setSystemDark(matches: boolean) {
  setMediaQuery('(prefers-color-scheme: dark)', matches)
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() {
      return values.size
    },
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, String(value)),
  } satisfies Storage,
})

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => mediaState(query).list,
})

afterEach(() => {
  for (const state of mediaStates.values()) {
    state.listeners.clear()
    state.legacyListeners.clear()
  }
  mediaStates.clear()
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})
