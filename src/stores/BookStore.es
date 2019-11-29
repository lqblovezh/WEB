import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'
import lang from 'lodash/lang'
import array from 'lodash/array'

import i18n from '~/i18n'
import initSchema from '~/core/initSchema'
import {loading} from './decorators'
import getDataByPathExp from '~/core/getDataByPathExp'


const CONTENT_TYPES = ['image', 'text']

const TEXT_LAYOUTS = {
  'lr/auto': {
    writingMode: 'lr',
    lineBreakEnabled: false,
  },
  'lr/static': {
    writingMode: 'lr',
    lineBreakEnabled: false,
  },
  'vrl/auto': {
    writingMode: 'vrl',
    lineBreakEnabled: false,
  },
  'vrl/static': {
    writingMode: 'vrl',
    lineBreakEnabled: true,
  },
}

function matchTextLayout(values) {
  if (values) {
    const {
      lineBreakEnabled,
      writingMode,
    } = values
    for (let key in TEXT_LAYOUTS) {
      let value = TEXT_LAYOUTS[key]
      if (value.writingMode === writingMode
        && value.lineBreakEnabled === lineBreakEnabled) {
        return key
      }
    }
  }
  return null
}


export default class BookStore {
  constructor(settings) {
    if (!document.title) {
      this.titleConfigurable = true
    }
  }

  bookId = null
  titleConfigurable = false

  @observable bookName = null
  @observable bookCategory = null
  @observable contentType = null
  @observable menus = null
  @observable menuStatus = {}
  @observable currentMenuStatusKey = null
  @observable labels = null
  @observable schema = null

  @computed get textLayout() {
    return matchTextLayout(this.schema)
  }

  @computed get verticalMode () {
    return /^v/.test(this.textLayout)
  }

  getMenuStatus (menu, chapterRid) {
    const {
      chapter_id: chapterId,
      xml_id: xmlId,
    } = menu

    let status = null
    if (chapterRid && xmlId) {
      status = this.menuStatus[chapterRid +':'+ xmlId]
    }
    if (!status && chapterId) {
      status = this.menuStatus[chapterId]
    }
    if (!status && chapterRid) {
      status = this.menuStatus[chapterRid]
    }
    return status
  }

  getRootMenu (chapterId) {
    const status = this.menuStatus[chapterId]
    if (status) {
      const lastId = array.last(status.pids)
      if (lastId) {
        return this.menuStatus[lastId].data
      } else {
        status.data
      }
    }
    return null
  }

  getLastMenu (chapterId) {
    let {
      data: {
        menu: list,
      }
    } = this.menuStatus[chapterId] || {data:{}}
    let last = null
    while(list && list.length) {
      last = array.last(list)
      list = last.menu
    }
    return last
  }

  @action toggleMenu (menu, chapterRid) {
    const status = this.getMenuStatus(menu, chapterRid)
    if (!status) {
      return
    }

    status.visible = !status.visible

    const currentStatus = this.menuStatus[this.currentMenuStatusKey]

    if (currentStatus.pids.indexOf(status.id) !== -1) {
      status.active = !status.visible
    }
  }

  @action activateMenu (chapterId, xmlId, chapterRid) {
    const status = this.getMenuStatus({
      chapter_id: chapterId,
      xml_id: xmlId,
    }, chapterRid)
    if (!status) {
      return
    }

    this.currentMenuStatusKey = status.id

    for (let key in this.menuStatus) {
      let temp = this.menuStatus[key]

      if (status.pids.indexOf(temp.id) !== -1) {
        continue
      } else if (status.id === temp.id) {
        status.active = true
        status.pids.forEach(pid => {
          const _status = this.menuStatus[pid]
          _status.visible = true
          _status.active = false
        })
      } else {
        temp.active = false
      }
    }
  }

  setTextLayout = async (textLayout) => {
    const data = TEXT_LAYOUTS[textLayout]
    if (data) {
      const {
        writingMode,
        lineBreakEnabled,
      } = data
      runInAction(() => {
        this.schema.writingMode = writingMode;
        this.schema.lineBreakEnabled = lineBreakEnabled;
      })
      await this.stores.chapterStore.renderText()
    }
  }

  getPrevChapterId (chapterRid) {
    for(let i=0, length=this.menus.length; i<length; i++) {
      if (this.menus[i].chapter_id == chapterRid && i - 1 >= 0) {
        return this.menus[i-1].chapter_id
      }
    }
    return null
  }

  getNextChapterId (chapterRid) {
    for(let i=0, length=this.menus.length; i<length; i++) {
      if (this.menus[i].chapter_id == chapterRid && i + 1 < length) {
        return this.menus[i+1].chapter_id
      }
    }
    return null
  }

  getBookInfo = async (bookId) => {
    const { bookmarkStore } = this.stores
    const {
      book_name,
      // book_author,
      // book_cover,
      book_category,
      text_layout,
      reader_type,
      menu,
      note,
      bookmark,
    } = await this.services.get_book({bookId}, this.settings)
    runInAction(() => {
      this.bookId = bookId
      this.bookName = book_name
      this.bookCategory = book_category
      this.contentType = CONTENT_TYPES[reader_type] || null
      this.schema = initSchema({
        ...TEXT_LAYOUTS[text_layout],
      })
      bookmarkStore.bookmarks = (bookmark || []).map(bookmark => ({
        ...bookmark,
        position: JSON.parse(bookmark.range)
      }))
      this.menus = menu || []
      this.menuStatus = initMenuStatus(this.menus)
      this.labels = (note || []).map(label => ({
        ...label,
        range: /^(\[|\{)/.test(label.range) ? JSON.parse(label.range) : null,
      }))
    })

    if (this.titleConfigurable) {
      document.title = book_name
    }
  }

  @loading
  openBook = async ({
    bookId,
    chapterRid,
    xmlId,
  }) => {
    const {
      chapterStore,
      otherLabelStore,
    } = this.stores
    const {
      otherLabelEnabled,
    } = this.settings

    await this.getBookInfo(bookId);
    if (otherLabelEnabled && bookId) {
      await otherLabelStore.getOtherLabels({bookId})
    }
    if (!chapterRid) {
      chapterRid = (this.menus[0] || {}).chapter_id
    }

    if (chapterRid) {
      await chapterStore.openChapter({chapterRid, xmlId})
    } else {
      console.warn(i18n.NF_CHAPTER());
    }
  }

  @loading
  openMenu = async (menu, chapterRid) => {
    const {chapterStore} = this.stores
    console.log(chapterStore);
    await chapterStore.openChapter({
      chapterRid: chapterRid || menu.chapter_id,
      xmlId: menu.xml_id,
    })
  }

  @loading
  openLabel = async (label) => {
    if (lang.isString(label.range)) {
      label.range = JSON.parse(label.range)
    }
    let {range, chapterId} = label;
    const {chapterStore} = this.stores
    chapterStore.highlightLabel = label;
    if(chapterStore.chapterRid !== chapterId){
      await chapterStore.openChapter({
        chapterRid: chapterId,
        position: range.start,
        keepHighlightLabel: true,
      })
    }else {
      await chapterStore.goPage(range.start)
    }

  }

  @action
  addLable(label){
    if(lang.isString(label.range)){
      label.range = JSON.parse(label.range)
    }
    this.labels.push(label)
  }

  @action
  removeLable(labelId){
    for (let i = 0 , len = this.labels.length ;i<len ; i++ ) {
      if(labelId ===  this.labels[i].id){
        this.labels.splice(i,1)
        return
      }
    }
  }
}

function initMenuStatus (menus, pids = [], status = {}) {
  menus.forEach(menu => {
    const {
      chapter_id: chapterId,
      xml_id: xmlId,
    } = menu

    status[chapterId] = {
      id: chapterId,
      pids,
      visible: false,
      active: false,
      data: menu,
    }

    const chapterRid = pids[0]
    if (chapterRid && xmlId) {
      status[chapterRid +':'+ xmlId] = status[chapterId]
    }

    initMenuStatus(menu.menu, pids.concat([chapterId]), status)
  })

  return status
}
