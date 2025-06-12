'use client'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">Welcome back to Bloom</h1>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-md" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-md" />
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">Login</button>
        </form>
        <p className="text-center text-sm text-text-muted">
          Don't have an account? <Link href="/sign-up" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
