import { Cormorant_Garamond, Nunito } from 'next/font/google'
import { MarketingNav } from '@/components/landing/MarketingNav'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-nunito',
})

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${cormorant.variable} ${nunito.variable}`}>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
