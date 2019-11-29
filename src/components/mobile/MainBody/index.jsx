import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import classnames from 'classnames'

import css from './style.css'
import {addEvent, removeEvent} from '~/utils/event'
import TextView from '~/components/mobile/TextView'
import ImageView from '~/components/mobile/ImageView'
import i18n from '~/i18n'


@inject('layoutStore', 'bookStore', 'chapterStore',
  'settingStore', 'toolStore', 'labelStore',
  'searchStore', 'textToolStore', 'popoverStore', 'bookmarkStore', 'otherLabelStore')
@observer
export default class MainBody extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    addEvent(document, "keydown", this.keyDownHandler)
    addEvent(document, "mousedown", this.mouseUpHandler)
  }

  componentWillUnmount() {
    removeEvent(document, "keydown", this.keyDownHandler)
    removeEvent(document, "mousedown", this.mouseUpHandler)
  }

  keyDownHandler = (events) => {
    const {
      chapterStore,
    } = this.props
    switch (events.keyCode) {
      case 33:
      case 37:
        chapterStore.prevPage()
        break;
      case 34:
      case 39:
        chapterStore.nextPage()
        break;
    }
  }

  mouseUpHandler = (evt) => {
    const {
      popoverStore
    } = this.props;
    popoverStore.close()
  }

  clearSearchResultHandler = () => {
    // this.props.searchStore.clearData()
  }

  otherLabelClick = () => {
    this.props.toolStore.toggle('othersLabel')
  }

  clickHandler = (e) => {
    const {
      chapterStore,
    } = this.props
    const offsetLeft = e.clientX / window.innerWidth;
    if (offsetLeft < 1 / 3) {
      chapterStore.prevPage()
    } else if (offsetLeft > 2 / 3) {
      chapterStore.nextPage()
    } else {
      this.props.toolStore.toggle('toolBar')
    }
  }

  bookmarkHandler = (e) => {
    const {bookmarkStore} = this.props;
    const {
      bookmarkCurrent,
      addBookmark,
      removeBookmark
    } = bookmarkStore
    if (bookmarkCurrent.length) {
      removeBookmark()
    } else {
      addBookmark()
    }
    e.stopPropagation()
  }

  render() {
    const {
      bookStore,
      chapterStore,
      settingStore,
      layoutStore,
      bookmarkStore,
      otherLabelStore,
    } = this.props

    const {contentType} = bookStore

    const {
      bookmarkCurrent,
      settings:{
        bookmarkEnabled,
        otherLabelEnabled,
      }
    } = bookmarkStore

    const [
      color,
      backgroundColor,
      selector,
    ] = settingStore.colorAndBg
    const {
      otherLabelsList,
      pages,
    } = otherLabelStore
    return (
      <div className={classnames({
        [css.wrapper]: true,
        [selector]: settingStore.colorAndBg.length > 2,
      })}
           ref={layoutStore.updateMainBodyBox}
           style={{
             backgroundColor,
             color,
           }}
           onClick={this.clickHandler}
      >
        { bookmarkEnabled && (
          <div className={classnames({
            [css.chapterName]: true,
            [css.current]: bookmarkCurrent.length,
          })} >
            {chapterStore.chapterName}
            { contentType==='text' && (
                <span className={css.icon} onClick={this.bookmarkHandler}></span>
              )
            }
          </div>
        )
        }
        {
          bookStore.contentType === 'image' ? <ImageView /> : <TextView />
        }
        <div className={css.footer}>
          { otherLabelEnabled && pages && (
              <div className={css.otherLabel} onClick={this.otherLabelClick}>{i18n.OTHER_LABEL_TOTAL({num: pages.totalCount})}</div>
            )
          }
        </div>
      </div>
    )
  }
}
