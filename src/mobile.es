import Mobile from '~/components/mobile/Layout'
import App from '~/components/App'

module.exports = class extends App {
  constructor (...args) {
    super(Mobile, ...args)
  }
}
