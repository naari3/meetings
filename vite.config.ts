import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'gcal-assets',
      buildStart() {
        const eventsPath = join(process.cwd(), 'public', 'events.json')
        const icsPath = join(process.cwd(), 'dist', 'naari3-meetings.ics')

        if (!existsSync(eventsPath)) {
          throw new Error("❌ events.json not found. Run 'pnpm cal-build' first.")
        }

        if (!existsSync(icsPath)) {
          throw new Error("❌ naari3-meetings.ics not found. Run 'pnpm cal-build' first.")
        }

        try {
          const icsContent = readFileSync(icsPath, 'utf-8')
          this.emitFile({
            type: 'asset',
            fileName: 'naari3-meetings.ics',
            source: icsContent,
          })

          const eventsContent = readFileSync(eventsPath, 'utf-8')
          this.emitFile({
            type: 'asset',
            fileName: 'events.json',
            source: eventsContent,
          })

          const eventsData = JSON.parse(eventsContent)
          console.log(`✅ Using pre-generated calendar resources (${eventsData.events.length} events)`)
        } catch (error) {
          throw new Error(`❌ Failed to read calendar resources: ${error}`)
        }
      },
    },
  ],
})