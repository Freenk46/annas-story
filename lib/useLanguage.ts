'use client'

import { useState, useEffect } from 'react'
import en from '@/messages/en.json'
import ru from '@/messages/ru.json'
import ka from '@/messages/ka.json'

const messages = { en, ru, ka }
export type Locale = 'en' | 'ru' | 'ka'

const STORAGE_KEY = 'prototype-locale'
const EVENT_KEY   = 'prototype-locale-change'

export function useLanguage() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // Hydrate from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    const initial = (stored && messages[stored]) ? stored : 'en'
    setLocale(initial)
    document.body.classList.toggle('font-georgian', initial === 'ka')

    // Sync with any other mounted useLanguage instance that switches locale
    const handler = (e: Event) => {
      const lang = (e as CustomEvent<Locale>).detail
      setLocale(lang)
      document.body.classList.toggle('font-georgian', lang === 'ka')
    }
    window.addEventListener(EVENT_KEY, handler)
    return () => window.removeEventListener(EVENT_KEY, handler)
  }, [])

  const switchLocale = (lang: Locale) => {
    setLocale(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.body.classList.toggle('font-georgian', lang === 'ka')
    // Notify all other useLanguage instances on this page
    window.dispatchEvent(new CustomEvent<Locale>(EVENT_KEY, { detail: lang }))
  }

  return { locale, switchLocale, t: messages[locale] }
}
