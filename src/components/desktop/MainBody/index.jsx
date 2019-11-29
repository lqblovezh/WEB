import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import classnames from 'classnames'

import css from './style.css'
import { addEvent, removeEvent } from '~/utils/event'
import TextView from '~/components/desktop/TextView'
import ImageView from '~/components/desktop/ImageView'

@inject('layoutStore', 'bookStore', 'chapterStore',
'settingStore', 'toolStore','labelStore',
'searchStore', 'textToolStore','popoverStore')
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
    } = this.props
    popoverStore.close()
  }

  clearSearchResultHandler = () => {
    this.props.searchStore.clearData()
  }

  render() {
    const {
      bookStore,
      chapterStore,
      settingStore,
      layoutStore,
      textToolStore,
      popoverStore,
    } = this.props

    const [
      color,
      backgroundColor,
      selector,
    ] = settingStore.colorAndBg

    return (
      <div className={classnames({
        [css.wrapper]: true,
        [selector]: settingStore.colorAndBg.length > 2,
      })}
        ref={layoutStore.updateMainBodyBox}
        onClick={this.clearSearchResultHandler}
        style={{
          backgroundColor,
          color,
        }}
      >

        {
          bookStore.contentType === 'image' ? <ImageView /> : <TextView />
        }

        <div className={css.nextBtn} onClick={evt => chapterStore.nextPage()}></div>
        <div className={css.prevBtn} onClick={evt => chapterStore.prevPage()}></div>

      </div>
    )
  }
}
