import DefaultTheme from 'vitepress/theme'
import LandingSections from './LandingSections.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('LandingSections', LandingSections)
  }
}
