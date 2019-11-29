import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, toJS} from 'mobx'

import css from './style.css'

@observer

export default class InnerContainer extends Component {

  innerEl = null

  cancelBubble (e) {
    e.stopPropagation();
  }

  componentDidMount() {
    this.innerEl.addEventListener('click', this.cancelBubble)
    this.innerEl.addEventListener('mouseup', this.cancelBubble)
    this.innerEl.addEventListener('mousedown', this.cancelBubble)
  }



  componentWillUnmount() {
    this.innerEl.removeEventListener('click',this.cancelBubble);
    this.innerEl.removeEventListener('mouseup',this.cancelBubble);
    this.innerEl.removeEventListener('mousedown',this.cancelBubble);
  }

  render() {
    return <div ref={(el) => this.innerEl = (el)} className={css.wrapper}>
      {this.props.children}
    </div>
  }
}
