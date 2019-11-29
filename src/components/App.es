import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {useStrict} from 'mobx'
import { Provider } from 'mobx-react'
import merge from 'merge'
import urlParse from 'url-parse'

import i18n from '~/i18n'
import createStores from '~/stores/createStores'
import * as services_dev from '~/services.dev'
import defaultSettings from '~/settings'

useStrict(true)

export default class {
  constructor(rootComponent, {
    services,
    ...settings,
  } = {}) {
    this.rootComponent = rootComponent
    this.services = services || services_dev
    this.settings = merge(true, defaultSettings, settings)
  }

  static version = __VERSION__

  container = null

  mount (container, callback = () => {}) {
    this.unmount()

    const {
      query: {
        bookId,
        chapterId,
        chapterRid,
        xmlId,
      }
    } = urlParse(location.href, true)

    const params = {
      bookId,
      chapterRid: chapterRid || chapterId,
      xmlId,
    }

    const App = this.rootComponent
    ReactDOM.render((
      <Provider {...createStores(this.settings, this.services)  }  params={params}  >
        <App params={params} />
      </Provider>
    ), container, (...args) => {
      this.container = container
      callback(...args)
    })
  }

  unmount () {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container.children[0])
      this.container = null
    }
  }

}
