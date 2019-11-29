import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction,
  when,
} from 'mobx'
import delay from 'delay'
import merge from 'merge'
import lang from 'lodash/lang'

import i18n from '~/i18n'
import updateURL from '~/utils/updateURL'
import parse from '~/core/parse'
import serialize from '~/core/serialize'
import splitPage from '~/core/splitPage'
import splitPageByPageNumber from '~/core/splitPageByPageNumber'
import extractData from '~/core/extractData'
import comparePathExp from '~/core/comparePathExp'
import getDataByPathExp from '~/core/getDataByPathExp'
import queryDataById from '~/core/queryDataById'
import queryDataByKeyword from '~/core/queryDataByKeyword'
import {
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  NOT_EQUAL,
} from '~/core/enum/compareValues'

import {loading} from './decorators'

export default class ChapterStore {
  constructor(settings) {
  }

  chapterRid = null

  position = null

  metadata = null

  @observable comparisons = null

  @observable spectialComparison = null

  @observable images = null

  @observable pages = null

  @observable pageIndex = null

  @observable tempContent = null

  @observable content = null

  @observable contentHeight = 'auto'

  highlightLabel = null

  keyword = null

  keywordDataList = null

  initKeyword(keyword) {
    if (keyword) {
      const dataList = queryDataByKeyword(this.metadata, keyword)
      if (dataList.length) {
        this.keyword = keyword
        this.keywordDataList = dataList
      }
    }
  }

  @computed get validComparisons() {
    const list = []
    const page = this.pages ? this.pages[this.pageIndex] : null
    if (page && this.comparisons) {
      for (let comparison of this.comparisons) {
        if (comparePathExp(comparison.pathExp, page.end.pathExp, true) == GREATER_THAN) {
          list.push(comparison)
          break
        }
        if (comparePathExp(comparison.pathExp, page.start.pathExp, true) != GREATER_THAN) {
          continue
        }
        if (comparePathExp(comparison.pathExp, page.end.pathExp, true) == LESS_THAN) {
          list.push(comparison)
          continue
        }
      }
    }
    return list.map(item => toJS(item))
  }

  @computed get lastPageIndex() {
    const {length} = this.pages || []
    return length > 0 ? length - 1 : 0
  }

  @computed get percentPageIndex() {
    const {length} = this.pages || []
    if (!length) {
      return 0
    }
    return Math.round(this.percent * (length - 1))
  }


  @computed get currentPage() {
    return (this.pages || [])[this.pageIndex]
  }

  backBodyEl = null

  frontBodyEl = null

  @action clearData() {
    this.chapterRid = null
    this.position = null
    this.metadata = null
    this.comparisons = null
    this.images = null
    this.pages = null
    this.pageIndex = null
    this.keyword = null
    this.keywordDataList = null
    this.percent = 0
  }

  @loading
  openChapter = async ({
    chapterRid,
    xmlId = '',
    position,
    keyword,
    lastPage,
    keepHighlightLabel,
  }) => {
    const {
      bookStore,
    } = this.stores

    if (!keepHighlightLabel) {
      this.highlightLabel = null
    }

    bookStore.activateMenu('', xmlId, chapterRid)

    if (this.chapterRid !== chapterRid) {
      updateURL({
        chapterId: chapterRid,
        xmlId,
      })
      await this.clearData()
      await this.getChapterInfo({chapterRid, xmlId})
      this.initKeyword(keyword)
      if (lastPage) {
        await this.goPage(this.lastPageIndex)
      }
    } else {
      updateURL({
        xmlId,
      })
      this.initKeyword(keyword)

      if (position || xmlId){
        position = position || this.findPositionById(xmlId)
        if (position) {
          await this.goPage(position)
        } else {
          console.warn(i18n.NF_SECTION({xmlId, position}))
        }
      } else {
        await this.goPage(0)
      }
    }
  }

  getChapterInfo = async({chapterRid, xmlId}) => {
    const {
      bookStore
    } = this.stores

    const {
      chapter: {
        content: xml,
        chapter_item: images,
        chapter_name,
      },
      _settings,
    } = await this.services.get_chapter({
      bookId: bookStore.bookId,
      chapterRid,
    }, this.settings)

    this.chapterRid = chapterRid

    if (xml) {
      const {
        metadata,
        comparisons,
      } = await parse(xml, {
        ...this.settings,
        ..._settings,
      })

      runInAction(() => {
        this.metadata = metadata
        this.comparisons = comparisons
        this.chapterName = chapter_name
        if (xmlId) {
          this.position = this.findPositionById(xmlId)
        }
      })

      await delay().then(() => this.renderText())
    } else if (images) {
      runInAction(() => {
        this.images = images.map(({
          value: {value = []},
          pagingnumber,
          pagingposition,
        }) => {
          const {
            imagedata: {
              src,
            }
          } = value[0] || {}
          return {
            pageLabel: pagingposition,
            pageValue: pagingnumber,
            src,
          }
        })
      })

      await this.renderImage()
    }
  }

  serialize(data, settings) {
    const {
      bookStore,
    } = this.stores


    const highlightRanges = []
    if (this.highlightLabel) {
      highlightRanges.push({
        range: this.highlightLabel.range,
        attrs: [{
          'class': {
            'reader__label--active': true,
          },
        }]
      })
    }

    const opts = {
      ...settings,
      highlightRanges,
      keyword: this.keyword,
      keywordDataList: this.keywordDataList,
    }

    if (bookStore.labels) {
      opts.labels = toJS(bookStore.labels).filter(label => label.chapterId === this.chapterRid)
    }

    return serialize(data, opts)
  }

  @loading
  renderText = async() => {
    const metadata = this.metadata
    const {
      bookStore,
    } = this.stores
    const schema = toJS(bookStore.schema)
    const {textLayout} = bookStore
    switch (textLayout) {
      case 'lr/auto':
      case 'vrl/auto':
        await delay(50).then(action(() => {
          this.tempContent = this.serialize(metadata, {
            schema,
          })
        }))

        const {
          children,
          clientHeight: maxHeight,
          clientWidth: maxWidth,
        } = this.backBodyEl

        if (children.length > 0) {
          await delay(50).then(() => splitPage(children[0], {
            schema,
            metadata,
            maxHeight,
            maxWidth,
          })).then(action((pages) => {
            this.pages = pages
            this.tempContent = null
          }))
        } else {
          console.warn(i18n.NF_CONTENT())
        }
        break
      case 'vrl/static':
        runInAction(() => {
          this.pages = splitPageByPageNumber(metadata)
        })
        if (this.pages.length == 0) {
          bookStore.setTextLayout(schema.writingMode + '/auto')
          return
        }
        break
      default:
        console.warn(i18n.NF_TEXT_LAYOUT({textLayout}))
    }

    await delay(50).then(() => {
      this.goPage(this.position || 0)
    })
  }

  renderImage = async() => {
    runInAction(() => {
      this.pages = this.images.map(({
        pageLabel,
        pageValue,
      }) => ({
        label: pageLabel,
        value: pageValue,
      }))
    })

    await this.goPage(0)
  }

  goPage = async(indexOrPosition) => {
    if (!this.pages || this.pages.length == 0) {
      return
    }

    let pageIndex = 0
    if (lang.isInteger(indexOrPosition)) {
      pageIndex = indexOrPosition
    } else {
      pageIndex = this.getPageIndexByPosition(indexOrPosition)
      console.log('按路径翻页：', pageIndex, indexOrPosition)
    }

    let page = this.pages[pageIndex < this.pages.length ? pageIndex : (pageIndex = 0)]
    if (page) {
      page = toJS(page)
      if (lang.isInteger(indexOrPosition)) {
        this.position = page.start
      }
      let content = null
      const {
        contentType,
        textLayout,
      } = this.stores.bookStore

      switch (contentType) {
        case 'image':
          content = this.images[pageIndex]
          break
        case 'text':
          if (this.metadata) {
            const metadata = this.metadata
            const schema = toJS(this.stores.bookStore.schema)

            const partData = extractData(metadata, {
              ...page,
            })
            content = this.serialize(partData, {
              schema,
            })
          }
          break
      }
      if (content) {
        runInAction(() => {
          this.contentHeight = textLayout === 'vrl/static' ? '10000px' : 'auto'
          this.content = content
          this.pageIndex = pageIndex
          this.percent = pageIndex / (this.pages.length - 1)
        })
        if (contentType === 'text') {
          await delay(50).then(() => {
            this.afterRenderText()
          })
        }
      }
    }
  }

  prevPage = async () => {
    const {
      bookStore
    } = this.stores
    if (this.pageIndex - 1 >= 0) {
      await this.goPage(this.pageIndex - 1)
    } else {
      const chapterRid = bookStore.getPrevChapterId(this.chapterRid)
      if (chapterRid) {
        const menu = bookStore.getLastMenu(chapterRid)
        let xmlId
        if (menu) {
          xmlId = menu.xml_id
        }
        await this.openChapter({chapterRid, xmlId, lastPage: true})
      } else {
        console.warn(i18n.NF_PREV_PAGE())
      }
    }
  }

  nextPage = async() => {
    if (!this.pages) {
      return
    }
    if (this.pageIndex + 1 < this.pages.length) {
      await this.goPage(this.pageIndex + 1)
    } else {
      await this.nextChapter()
    }
  }

  getPageIndexByPosition(position) {
    if (this.pages && position) {
      const {
        pathExp,
        index = 0,
      } = position
      for (let i = 0, length = this.pages.length; i < length; i++) {
        let page = this.pages[i]
        let value = comparePathExp(pathExp, page.end.pathExp, true)
        if (value == LESS_THAN) {
          return i
        } else if (value == EQUAL) {
          if (index <= (page.end.index || 0)) {
            return i
          }
        }
      }
    }
    return -1
  }

  findPositionById(xmlId) {
    const data = queryDataById(this.metadata, xmlId)
    return data ? {
      pathExp: data.pathExp,
    } : null
  }

  @action openSpectialComparison = (node) => {
    const pathExp = node.getAttribute('data-pathexp')
    const data = getDataByPathExp(this.metadata, pathExp)
    this.spectialComparison = data
  }

  @action closeSpectialComparison = () => {
    this.spectialComparison = null
  }

  afterRenderText() {
    if (!this.frontBodyEl) {
      console.warn('容器初始化失败！');
      return
    }
    const {textLayout} = this.stores.bookStore
    if (textLayout === 'vrl/static') {
      runInAction(() => {
        const {clientHeight} = this.frontBodyEl.querySelector('*[data-pathexp="$"]')||0
        console.log(clientHeight)
        this.contentHeight = clientHeight + 50 + 'px'
      })
    }

    const {
      openSpectialComparison,
      stores,
    } = this

    const {
      popoverStore
    } = stores

    let nodeList

    nodeList = this.frontBodyEl.querySelectorAll('.reader__label');
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].onclick = function () {
        popoverStore.close()
        popoverStore.open(this)
      }
    }

    nodeList = this.frontBodyEl.querySelectorAll('.reader__comparisonBtn');
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].onclick = function () {
        openSpectialComparison(this)
      }
    }
  }

  nextChapter = async() => {
    const {
      bookStore
    } = this.stores
    const chapterRid = bookStore.getNextChapterId(this.chapterRid)
    if (chapterRid) {
      await this.openChapter({chapterRid})
    } else {
      console.warn(i18n.NF_NEXT_PAGE())
    }
  }

  prevChapter = async() => {
    const {
      bookStore
    } = this.stores
    const chapterRid = bookStore.getPrevChapterId(this.chapterRid)
    if (chapterRid) {
      await this.openChapter({chapterRid})
    } else {
      console.warn(i18n.NF_NEXT_PAGE())
    }
  }
}
