'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    
    // (You can add form validation or fake logic here)
    
    // 🔁 Redirect to onboarding
    router.push('/onboarding')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">Create your Bloom account</h1>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-text-muted">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </main>
  )
}
