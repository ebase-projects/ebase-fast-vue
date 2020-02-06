import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ebase fast vue'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
