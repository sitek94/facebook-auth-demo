import * as React from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  FacebookAuthProvider,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env['API_KEY'],
  authDomain: process.env['AUTH_DOMAIN'],
  projectId: process.env['PROJECT_ID'],
  storageBucket: process.env['STORAGE_BUCKET'],
  messagingSenderId: process.env['MESSAGING_SENDER_ID'],
  appId: process.env['APP_ID'],
}

const app = initializeApp(firebaseConfig)
const provider = new FacebookAuthProvider()

provider.setCustomParameters({
  display: 'popup',
})

const auth = getAuth(app)

function signInWithFacebook(onSuccess: (accessToken: string) => void) {
  return signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user
      const credential = FacebookAuthProvider.credentialFromResult(result)
      const accessToken = credential?.accessToken

      if (!accessToken) {
        throw new Error('Failed to get access token.')
      }

      console.log(`Signed in as ${user.displayName} using Facebook.`)
      onSuccess(accessToken)
    })
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = FacebookAuthProvider.credentialFromError(error)

      console.log(`Error signing in with Facebook: ${errorMessage}`)
      console.log({ errorCode, email, credential })
    })
}

export function App() {
  const [accessToken, setAccessToken] = React.useState('')

  React.useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(`User signed in: ${user.displayName}`)
      } else {
        console.log('User is signed out')
      }
    })
  }, [])

  function handleSignIn() {
    signInWithFacebook(setAccessToken).catch(error => {
      console.log(`Error signing in: ${error.message}`)
      console.log(error)
    })
  }

  return (
    <>
      <button onClick={handleSignIn}>Sign in with Facebook</button>
      {accessToken && <FacebookProfile accessToken={accessToken} />}
    </>
  )
}

const baseUrl = 'https://graph.facebook.com/v14.0'
const fields = ['id', 'name', 'email', 'feed'].join(',')

function FacebookProfile({ accessToken }: { accessToken: string }) {
  console.log('FacebookProfile')

  const [data, setData] = React.useState<any>()

  React.useEffect(() => {
    fetch(
      encodeURI(`${baseUrl}/me?fields=${fields}&access_token=${accessToken}`),
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(setData)
      .catch(error => {
        console.log(error)
      })
  }, [])

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
