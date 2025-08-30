import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Simulador de Pensiones - España',
  description: 'Simulador oficial de pensiones de jubilación del Sistema de Seguridad Social español',
  keywords: 'pensiones, jubilación, seguridad social, españa, simulador, cálculo',
  authors: [{ name: 'Sistema de Pensiones España' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    🏛️ Simulador de Pensiones
                  </h1>
                </div>
                <div className="hidden md:block ml-4">
                  <span className="text-sm text-gray-600">
                    Sistema de Seguridad Social - España
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Activo
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>
                © 2025 Simulador de Pensiones de Jubilación - España
              </p>
              <p className="mt-2">
                Sistema basado en la normativa oficial del Sistema de Seguridad Social
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Este simulador es orientativo y no constituye resolución administrativa oficial
              </p>
            </div>
          </div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
