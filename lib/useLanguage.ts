'use client'

import { useState, useEffect } from 'react'
import en from '@/messages/en.json'
import ru from '@/messages/ru.json'
import ka from '@/messages/ka.json'

const messages = { en, ru, ka }
export type Locale = 'en' | 'ru' | 'ka'

const STORAGE_KEY = 'prototype-locale'
const EVENT_KEY   = 'prototype-locale-change'

/** Priority: URL path segment [1] → localStorage → 'en' */
function resolveInitialLocale(): Locale {
  const pathLocale = window.location.pathname.split('/')[1] as Locale
  if (messages[pathLocale]) return pathLocale
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  return stored && messages[stored] ? stored : 'en'
}

export function useLanguage() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const initial = resolveInitialLocale()
    setLocale(initial)
    localStorage.setItem(STORAGE_KEY, initial)   // keep storage aligned with URL

    // Sync state across all useLanguage instances on the same page
    const handler = (e: Event) => {
      const lang = (e as CustomEvent<Locale>).detail
      setLocale(lang)
    }
    window.addEventListener(EVENT_KEY, handler)
    return () => window.removeEventListener(EVENT_KEY, handler)
  }, [])

  /** Updates localStorage + notifies sibling instances.
   *  URL navigation is done separately in LanguageSwitcher via router.push(). */
  const switchLocale = (lang: Locale) => {
    setLocale(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    window.dispatchEvent(new CustomEvent<Locale>(EVENT_KEY, { detail: lang }))
  }

  return { locale, switchLocale, t: messages[locale] }
}
