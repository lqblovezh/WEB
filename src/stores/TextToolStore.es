import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'
import copy from 'copy-to-clipboard'

import {addEvent, removeEvent} from '~/utils/event'
import setPopoverPlacement from '~/utils/setPopoverPlacement'
import serialize from '~/core/serialize'
import extractData from '~/core/extractData'

export default class TextToolStore {
  constructor(settings) {
    const {
      indexingEnabled,
      labelEnabled,
      copyEnabled,
    } = settings
    this.enabled = indexingEnabled || labelEnabled || copyEnabled
  }

  enabled = false
  @observable _visible = false
  @computed get visible () {
    return this.enabled && this._visible
  }

  @observable range = null
  @observable labeldIds = null
  @observable beginRect = null
  @observable endRect = null
  selectedText = null
  focusNode = null

  @action close() {
    this._visible = false
    this.focusNode = null
  }

  @action open(selection) {
    if (selection) {
      console.warn('选择内容', JSON.stringify(selection, null,'  '))
      this.selectedText = selection.selectedText
      this.range = selection.range
      this.labeldIds = selection.labelIds
      this.focusNode = selection.focusNode
      this.beginRect = selection.beginRect
      this.endRect = selection.endRect
      this._visible = true
    }
  }

  copySelectedText = () => {
    copy(this.selectedText)
    this.close()
  }

  addIndexingHandler = async() => {
    const {
      bookStore,
      chapterStore,
    } = this.stores
    let res = await this.services.add_ingdexing({
      bookId: bookStore.bookId,
      chapterRid: chapterStore.chapterRid,
      rangeJSON: JSON.stringify(toJS(this.range)),
      selectedText: this.selectedText,
    }, this.settings);
  }

  focus = (el) => {
    if (el && this.focusNode) {
      const {
        chapterStore,
        bookStore,
      } = this.stores
      setPopoverPlacement(el, chapterStore.frontBodyEl, this.beginRect, this.endRect, bookStore.verticalMode)
    } else {
      this.close()
    }
  }
}
