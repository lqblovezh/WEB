import React, {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'

import css from './style.css'
import i18n from '~/i18n'
import moment from 'moment'

@inject('chapterStore', 'bookmarkStore', 'bookStore')
@observer
export default class BookmarkPanel extends Component {
  constructor(props) {
    super(props)
  }

  clickDeleteHandler(id) {
    if (confirm(i18n.BOOKMARK_DELETE_CONFIRM())) {
      this.props.bookmarkStore.removeBookmark(id)
    }

  }

  clickGoPageHandler(label) {
    if (label) {
      this.props.bookStore.openLabel(label);
    } else {
      console.warn(i18n.NF_SECTION({xmlId}))
    }
  }

  renderBookmarkList() {
    const {
      bookmarkStore,
      bookStore,
    } = this.props;
    const bookmarkList = bookmarkStore.bookmarkGroup

    if (bookmarkList.length) {
      return bookmarkList.map((items, index) => (
        <div key={index} className={css.list}>
          {
            items.bookmarks.map((item,index) => (
              <div key={index} className={css.itemField}>
                <div className={css.bookmarkTitle}>
                  <div className={css.btnList}>
                    <span className={css.upLabelBtn} onClick={e => this.clickDeleteHandler(item.id)}></span>
                  </div>
                  {`《${bookStore.bookName}》- ${items.chapterName || ''}`}
                </div>
                <div onClick={evt => this.clickGoPageHandler(item)} className={css.bookmarkText}>
                  {item.selectedText}
                </div>
                <div className={css.bookmarkTime}>
                  { moment(new Date(item.create_time * 1000)).format("YYYY-MM-DD HH:mm") }
                </div>
              </div>
            ))
          }
        </div>
      ))
    }

    return (
      <div className={css.noData}>
        <div className={css.noDataContent}>
          <div className={css.noDataImg}></div>
          <div className={css.noDataText}>{i18n.NF_BOOKMARK()}</div>
        </div>
      </div>
    )
  }

  render() {
    const {
      book,
    } = this.props
    return (
      <div className={css.wrapper}>
        {this.renderBookmarkList()}
      </div>
    )
  }
}
