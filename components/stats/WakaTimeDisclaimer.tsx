"use client"

import * as gtag from '@/lib/gtag'

export default function WakaTimeDisclaimer({ url }: { url?: string | null }) {
  const href = url ?? 'https://wakatime.com'

  const handleClick = () => {
    try {
      gtag.event('click_wakatime_profile', { category: 'outbound', label: href })
    } catch (e) {
      // noop
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-2"
    >
      <span className="leading-none">🚀</span>
      <span>Powered by WakaTime</span>
    </a>
  )
}
