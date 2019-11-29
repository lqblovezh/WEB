import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'

import css from './style.css'

export default class GestureGuide extends Component {
  constructor(props){
    super(props)
  }

  render () {
    return <div {...this.props} className={css.wrapper}></div>
  }
}
