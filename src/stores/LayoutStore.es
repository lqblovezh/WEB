import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'
import {observer, inject, Observer} from 'mobx-react'
import offset from 'global-offset'
import computedStyle from 'computed-style'

export default class LayoutStore {
  constructor() {
    const fontSize = computedStyle(document.documentElement, 'fontSize')
    this.baseFontSize = /px$/.test(fontSize) ? parseInt(fontSize) : 16
  }

  baseFontSize = null
  @observable brightness = 1

  convertPXtoREM(size) {
    return size / this.baseFontSize + 'rem'
  }

  @observable mainBodyBox = {
    width: 0,
    height: 0,
  }

  @action toggleBrightness = () => {
    this.brightness = this.brightness > 0 ? 0 : 1;
  }

  @action updateMainBodyBox = (el) => {
    if (el) {
      const {
        left, top
      } = offset(el)
      this.mainBodyBox.top = top
      this.mainBodyBox.left = left
      this.mainBodyBox.width = el.clientWidth
      this.mainBodyBox.height = el.clientHeight
    }
  }
}
