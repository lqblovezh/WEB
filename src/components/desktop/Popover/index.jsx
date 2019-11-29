import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import InnerContainer from '~/components/desktop/InnerContainer'

import css from './style.css'

@inject('popoverStore')
@observer
export default class Popover extends Component {

  render() {
    const {
      popoverStore,
    } = this.props
    return <div className={css.wrapper} ref={popoverStore.foucs}>
      <InnerContainer>
        <div className={css.content}>
          {popoverStore.message}
        </div>
      </InnerContainer>
    </div>
  }
}
