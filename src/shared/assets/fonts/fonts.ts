import { Lato, Golos_Text } from 'next/font/google'

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-lato',
})

const golos = Golos_Text({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
  variable: '--font-golos',
})

export {
  lato,
  golos,
}
