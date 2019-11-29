import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'

import css from './style.css'

export default class LoadingIcon extends Component {
  render () {
    return <div className={css.wrapper}></div>
  }
}
