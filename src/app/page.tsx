'use client'

import { useState, useEffect } from 'react'
import WaitlistModal from '@/components/WaitlistModal'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OPEN_WAITLIST_MODAL') {
        setIsModalOpen(true)
      }
    }

    // Listen for custom events (if not using iframe)
    const handleCustomEvent = () => {
      setIsModalOpen(true)
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('openWaitlistModal', handleCustomEvent)

    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('openWaitlistModal', handleCustomEvent)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Embed Framer HTML */}
      <iframe
        src="/plint-waitlist.html"
        className="h-screen w-full border-0"
        title="Plint Waitlist"
        allow="fullscreen"
        style={{ minHeight: '100vh' }}
      />
      
      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
