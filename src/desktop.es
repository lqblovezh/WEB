import Desktop from '~/components/desktop/Layout'
import App from '~/components/App'

module.exports = class extends App {
  constructor (...args) {
    super(Desktop, ...args)
  }
}
