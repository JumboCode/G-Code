import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Tutoring from './OfficeHours'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
