'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@/globals/globals.css'

export function showToast(msg: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', { detail: msg }))
  }
}

const LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'О нас', href: '/about' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Акции', href: '/sales' },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 transform transition ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <span className="font-bold text-lg">STR.KE</span>
          <button onClick={onClose}>✕</button>
        </div>

        <nav className="p-4 space-y-3">
          {LINKS.map((l) => (
            <div
              key={l.href}
              onClick={() => {
                router.push(l.href)
                onClose()
              }}
              className="cursor-pointer text-sm text-zinc-400 hover:text-white"
            >
              {l.label}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  const router = useRouter()

  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <header className="sticky top-0 z-30 bg-black/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <button onClick={onMenu}>☰</button>

        <div className="font-bold cursor-pointer" onClick={() => router.push('/')}>
          STR.KE
        </div>

        <div className="flex-1" />

        <button onClick={() => router.push('/cart')} className="relative">
          🛒
          {count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-white text-black px-1 rounded">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-10 p-6 text-sm text-zinc-400">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div>STR.KE</div>
        <div>© 2025</div>
      </div>
    </footer>
  )
}

function Toast() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: any) => {
      setMsg(e.detail)
      setTimeout(() => setMsg(null), 2000)
    }

    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [])

  if (!msg) return null

  return (
    <div className="fixed bottom-5 right-5 bg-black border border-zinc-700 px-4 py-2 rounded">
      {msg}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-black text-white min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Header onMenu={() => setOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

      <Footer />
      <Toast />
    </div>
  )
}
