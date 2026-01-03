import type { User } from '@supabase/supabase-js'
import { supabase } from '$lib/supabase'

export type AuthState = 'loading' | 'unauthenticated' | 'awaiting_otp' | 'authenticated'

export interface AuthStore {
  readonly state: AuthState
  readonly user: User | null
  readonly email: string
  readonly error: string | null
  sendOtp: (email: string) => Promise<void>
  verifyOtp: (token: string) => Promise<void>
  signOut: () => Promise<void>
}

export function createAuthStore(): AuthStore {
  let state = $state<AuthState>('loading')
  let user = $state<User | null>(null)
  let email = $state('')
  let error = $state<string | null>(null)

  // Check for existing session on init
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      user = session.user
      state = 'authenticated'
    }
    else {
      state = 'unauthenticated'
    }
  })

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      user = session.user
      state = 'authenticated'
    }
    else {
      user = null
      if (state !== 'awaiting_otp') {
        state = 'unauthenticated'
      }
    }
  })

  return {
    get state() {
      return state
    },
    get user() {
      return user
    },
    get email() {
      return email
    },
    get error() {
      return error
    },

    async sendOtp(inputEmail: string) {
      error = null
      email = inputEmail

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: inputEmail,
        options: {
          shouldCreateUser: true,
        },
      })

      if (otpError) {
        error = otpError.message
        return
      }

      state = 'awaiting_otp'
    },

    async verifyOtp(token: string) {
      error = null

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })

      if (verifyError) {
        error = verifyError.message
        return
      }

      // Auth state change listener will handle updating state
    },

    async signOut() {
      error = null
      await supabase.auth.signOut()
      state = 'unauthenticated'
      email = ''
    },
  }
}
