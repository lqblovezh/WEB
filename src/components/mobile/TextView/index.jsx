import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import classnames from 'classnames'

import {addEvent, removeEvent} from '~/utils/event'
import tryToGetSelection from '~/utils/tryToGetSelection'
import css from './style.css'

@inject('bookStore', 'chapterStore', 'settingStore', 'labelStore', 'textToolStore', 'toolStore')
@observer
export default class TextView extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {frontBodyEl} = this.props.chapterStore
    addEvent(frontBodyEl, 'mousedown', this.mouseDownHandler)
    addEvent(frontBodyEl, 'touchend', this.mouseUpHandler)
  }

  componentWillUnmount() {
    const {frontBodyEl} = this.props.chapterStore
    removeEvent(frontBodyEl, 'mousedown', this.mouseDownHandler)
    removeEvent(frontBodyEl, 'mouseup', this.mouseUpHandler)
  }

  mouseUpHandler = (evt) => {
    const selection = tryToGetSelection()
    if(selection){
      evt.preventDefault()
    }
    // console.log(selection);
    this.props.textToolStore.open(selection)
  }

  mouseDownHandler = (evt) => {
    const {textToolStore} = this.props;
    textToolStore.close()
  }

  hideHandler = () => {
    this.props.toolStore.toggle('toolBar')
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
           }}>

        <div className={[css.backBody, ...textLayoutSelectors].join(' ')}
             ref={el => chapterStore.backBodyEl = el}
             dangerouslySetInnerHTML={{__html: tempContent}}
        ></div>
        <div className={[css.frontBody, ...textLayoutSelectors].join(' ')}
             ref={el => chapterStore.frontBodyEl = el}
        >
          <div style={{
            height: chapterStore.contentHeight,
          }} dangerouslySetInnerHTML={{__html: content}}
          ></div>
        </div>
      </div>
    )
  }
}
