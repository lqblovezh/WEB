import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import classnames from 'classnames'

import { addEvent, removeEvent } from '~/utils/event'
import tryToGetSelection from '~/utils/tryToGetSelection'
import css from './style.css'

@inject('bookStore', 'chapterStore', 'settingStore', 'labelStore', 'textToolStore')
@observer
export default class TextView extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {frontBodyEl} = this.props.chapterStore
    addEvent(frontBodyEl, 'mousedown', this.mouseDownHandler)
    addEvent(document, 'mouseup', this.mouseUpHandler)
  }
  componentWillUnmount() {
    const {frontBodyEl} = this.props.chapterStore
    removeEvent(frontBodyEl, 'mousedown', this.mouseDownHandler)
    removeEvent(document, 'mouseup', this.mouseUpHandler)
  }

  mouseUpHandler = (evt) => {
    evt.preventDefault()
    const selection = tryToGetSelection()
    this.props.textToolStore.open(selection)
  }


  mouseDownHandler = (evt) => {
    const {textToolStore} = this.props;
    textToolStore.close()
  }

  render() {
    const {
      bookStore,
      chapterStore,
      settingStore,
    } = this.props

    const {
      textLayout,
    } = bookStore

    const {
      tempContent,
      content,
    } = chapterStore

    const textLayoutSelectors = (textLayout || '').split('/').map(key => css[key])

    return (
      <div className={css.wrapper}
        style={{
          fontSize: settingStore.fontSize,
          fontFamily: settingStore.fontFamily,
        }} >
        <div className={[css.backBody, ...textLayoutSelectors].join(' ')}
          ref={el => chapterStore.backBodyEl = el}
          dangerouslySetInnerHTML={{ __html: tempContent }}
        ></div>
        <div className={[css.frontBody, ...textLayoutSelectors].join(' ')}
          ref={el => chapterStore.frontBodyEl = el}
        >
          <div style={{
            height: chapterStore.contentHeight,
          }} dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
    )
  }
}
