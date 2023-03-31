import { Html, Main, NextScript } from 'next/document'
import Header from 'pages/components/Header'

export default function Document() {
  return (
    <Html lang="en">
      <Header />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
