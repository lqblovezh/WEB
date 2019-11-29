import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import merge from 'merge'
import lang from 'lodash/lang'

import css from './style.css'

@inject('loadingStore')
@observer
export default class MastLayer extends Component {

  static defaultProps = {
    keepBlur: false,
  }

  render () {
    const {
      loadingStore,
      keepBlur,
      children,
      style,
      fadeStyle,
      ...others,
    } = this.props

    const wrapperStyle = {
      ...style,
    }

    if (lang.isArray(children)) {
      wrapperStyle.display = children.find(child => child) ? 'block' : 'none'
    } else {
      wrapperStyle.display = children ? 'block' : 'none'
    }

    const backStyle = {
      ...fadeStyle,
    }

    if (loadingStore.visible && !keepBlur) {
      backStyle.backgroundColor = 'transparent'
    }

    return (
      <div className={css.wrapper} {...others} style={wrapperStyle}>
        <div className={css.backLayer} style={backStyle}></div>
        <div className={css.frontLayer}>
          { children }
        </div>
      </div>
    )
  }
}
