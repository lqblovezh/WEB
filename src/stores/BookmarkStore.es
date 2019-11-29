import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction
} from 'mobx'

import {loading} from './decorators'
import getTextByPathExp from '~/core/getTextByPathExp'
import isInRange from '~/core/isInRange'

export default class BookmarkStore {
  constructor(props) {
  }

  @observable bookmarks = []

  @computed get bookmarkCurrent() {
    const {
      chapterStore,
    } = this.stores
    const {currentPage} = chapterStore
    const list = []
    currentPage && this.bookmarks.forEach((item, index) => {
      if (isInRange(item.position, currentPage) && item.chapterId === chapterStore.chapterRid) {
        list.push(item.id);
      }
    })
    return list
  }

  @computed get getBookmarkList() {
    return this.bookmarks || []
  }

  @computed get bookmarkGroup() {
    const {
      bookStore,
    } = this.stores
    const {menus} = bookStore
    const list = [], map = {}

    menus && menus.forEach(({chapter_id, chapter_name}) => {
      list.push(map[chapter_id] = {
        chapterName: chapter_name,
        bookmarks: [],
      })
    })

    this.bookmarks.forEach(bookmark => {
      const item = map[bookmark.chapterId]
      if (item) {
        item.bookmarks.push(bookmark)
      }
    })
    return list.filter(item => item.bookmarks.length > 0);
  }

  @action addBookmark = async() => {
    const {
      bookStore,
      textToolStore,
      chapterStore,
    } = this.stores

    const {
      currentPage,
      metadata,
    } = chapterStore

    if (!currentPage) {
      return;
    }
    console.log(metadata,toJS(currentPage))
    const text = getTextByPathExp(metadata,currentPage.start);
    console.log(text);
    let res = await this.services.add_bookmark({
      bookId: bookStore.bookId,
      chapterRid: chapterStore.chapterRid,
      text,
      positingJSON: JSON.stringify(currentPage.start),
    }, this.settings);

    runInAction(() => {
      if (res.status) {
        this.bookmarks.push({
          ...res.data,
          position: JSON.parse(res.data.range)
        });
        console.log(toJS(this.bookmarks))
      }
    })
  }

  @action removeBookmark = async(id) => {
    const {
      bookmarkStore,
    } = this.stores

    const {bookmarkCurrent} = bookmarkStore

    if (id) {
      let res = await this.services.remove_bookmark({id}, this.settings);
      runInAction(() => {
        if (res.status) {
          this.bookmarks.splice(this.findIndex(id), 1);
        }
      })
    } else {
      for (let id of bookmarkCurrent) {
        let res = await this.services.remove_bookmark({id}, this.settings);
        runInAction(() => {
          if (res.status) {
            this.bookmarks.splice(this.findIndex(id), 1);
          }
        })
      }
    }
  }

  findIndex = (id) => {
    return this.bookmarks.findIndex((item) => {
      return item.id === id;
    });
  }
}
