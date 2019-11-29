import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'

import css from './style.css'
import i18n from '~/i18n'

@inject('textToolStore', 'labelStore')
@observer
export default class TextToolBar extends Component {
  constructor(props) {
    super(props)
  }

  clickHandler = (evt) => {
      const {
        textToolStore,
      } = this.props
      textToolStore.close()
  }

  addLabelHandler = () => {
    const {
      labelStore,
    } = this.props
    labelStore.showFormBox()
  }

  removeLabelHandler = () => {
    const {
      labelStore,
    } = this.props
    labelStore.removeLabels()
  }

  render () {
    const {
      textToolStore,
    } = this.props

    const {
      labeldIds,
      enabled,
      settings: {
        indexingEnabled,
        labelEnabled,
        copyEnabled,
      },
    } = textToolStore

    if (!enabled) {
      return null
    }
    return (      
      <div className={css.wrapper}
        ref={textToolStore.focus}
        onClick={this.clickHandler}
        >
          {
            indexingEnabled && <div onClick={textToolStore.addIndexingHandler}>{i18n.INDEXING()}</div>
          }
          {
            labelEnabled && (
              labeldIds && labeldIds.length
              ? <div key="1"
                onClick={this.removeLabelHandler}>{i18n.LABEL_CANCEL({labeldIds})}</div>
                : <div key="2"
                  onClick={this.addLabelHandler}>{i18n.LABEL()}</div>
                )
              }
              {
                copyEnabled && <div key="3" onClick={textToolStore.copySelectedText}>{i18n.COPY()}</div>
              }
            </div>
    )
  }
}
