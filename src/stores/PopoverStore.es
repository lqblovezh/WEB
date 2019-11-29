import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction
} from 'mobx'
import offset from 'global-offset'
import array from 'lodash/array'

import setPopoverPlacement from '~/utils/setPopoverPlacement'

export default class PopoverStore {
  constructor(settings) {
  }

  @observable visible = false
  @observable message = null

  labelEl = null
  position = null

  @action open = (node) => {
    const {bookStore} = this.stores
    const id = node.getAttribute('data-labelid')
    this.message = bookStore.labels.find(label => label.id == id)['userText']
    this.visible = true
    this.labelEl = node
  }

  @action close = () => {
    this.message = null
    this.visible = false
  }

  foucs = (el) => {
    if (!el || !this.labelEl) {
      this.close()
    } else {
      const {
        bookStore,
        chapterStore,
        layoutStore,
      } = this.stores

      const id = this.labelEl.getAttribute('data-labelid')
      const labelEls = chapterStore.frontBodyEl.querySelectorAll(`[data-labelid="${id}"]`)
      const beginRect = labelEls[0].getClientRects()[0]
      const endRect = array.last(array.last(labelEls).getClientRects())

      setPopoverPlacement(el, chapterStore.frontBodyEl, beginRect, endRect, bookStore.verticalMode)
    }
  }
}
