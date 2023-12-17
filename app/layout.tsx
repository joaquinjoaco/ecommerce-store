import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'


import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'

import './globals.css'

const font = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SportPolis | Tienda',
  description: 'Tienda de deportes Avenida Italia 4748 | Representante oficial Java Uruguay | ⏰Lunes a Viernes de 11 a 19 Sabado de 9 a 13. ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ModalProvider />
        <ToastProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
