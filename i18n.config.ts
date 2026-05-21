export const locales = ['ka', 'en', 'ru'] as const
export const defaultLocale = 'ka'
export type Locale = (typeof locales)[number]
