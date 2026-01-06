import { SpaceScene } from '@/shared/ui/space-scene/SpaceScene'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.page}>
      <SpaceScene />
    </main>
  )
}
