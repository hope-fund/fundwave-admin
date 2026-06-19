import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Fundwave Admin Operations',
  description: 'Ledger Engine Control Console',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F19]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
