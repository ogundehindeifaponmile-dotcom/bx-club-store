export const metadata = {
  title: 'BX CLUB | Blackxcellencee — Olfactory Atelier',
  description: 'Luxury hand-poured candles and diffusers.',
  icons: {
    icon: 'https://res.cloudinary.com/dzosy1sic/image/upload/w_32,h_32,c_fill/v1785715293/BX_CLUB_logo_oin4k5.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
