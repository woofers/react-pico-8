import Head from 'next/head'
import 'prism-themes/themes/prism-dracula.css'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/react-pico-8/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>react-pico-8</title>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin="true"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
