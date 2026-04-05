import DefaultTheme from 'vitepress/theme'
import { MermaidMarkdown } from 'vitepress-plugin-mermaid'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MermaidMarkdown', MermaidMarkdown)
  },
}
