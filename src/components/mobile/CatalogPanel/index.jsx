import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'

import Tree from '~/components/mobile/Tree'

import css from './style.css'

@inject('chapterStore', 'bookStore')
@observer
export default class CatalogPanel extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      book,
    } = this.props
    return (
      <div className={css.wrapper}>
        <Tree />
      </div>
    )
  }
}
