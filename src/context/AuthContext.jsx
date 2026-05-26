import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../config/firebase'
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

const AuthContext = createContext()

// Map Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(error) {
  const code = error?.code || ''
  switch (code) {
    // Sign-in errors
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/wrong-password':
      return 'Incorrect email or password.'
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'

    // Sign-up errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.'
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.'

    // Google sign-in errors
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Please contact the administrator.'

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'

    default:
      return 'Something went wrong. Please try again.'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Handle redirect result on page load (for mobile Google sign-in fallback)
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user)
      }
    }).catch(() => {
      // Redirect result error handled silently
    })
  }, [])

  const loginWithGoogle = async () => {
    try {
      // Try popup first (works on desktop and some mobile browsers)
      const result = await signInWithPopup(auth, googleProvider)
      return { success: true, user: result.user }
    } catch (error) {
      // If popup is blocked or fails, fall back to redirect (better for mobile)
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider)
          // This will redirect the page, so we return a pending state
          return { success: true, redirecting: true }
        } catch (redirectError) {
          return { success: false, error: getFirebaseErrorMessage(redirectError) }
        }
      }
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  }

  const signupWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
