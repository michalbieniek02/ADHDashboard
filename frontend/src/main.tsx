import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import "@fontsource/inter/400.css";

import './styles/base.css'
import './styles/layout.css'
import './styles/cards.css'
import './styles/tasks.css'
import './styles/quick-add.css'
import './styles/finance.css'
import './styles/responsive.css'
import './styles/login.css'

import App from './App.tsx'

const googleClientId =
  "1019281453928-s7igkogp74to2mhhlf5ij5btci7vs4ge.apps.googleusercontent.com"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)