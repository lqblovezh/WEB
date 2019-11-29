import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import classnames from 'classnames'

import i18n from '~/i18n'
import css from './style.css'

@inject('searchStore')
@observer
export default class SearchBar extends Component {
  constructor (props) {
    super(props)
  }

  searchHandler = (evt) => {
    evt.preventDefault()
    const {
      searchStore
    } = this.props
    const val = evt.target.keyword.value
    if (!val) {
      return
    }

    searchStore.keyword = val
    searchStore.search({"pagesIndex" : 1})
  }

  render () {
    return (
        <div className={css.wrapper}>
          <form onSubmit={ this.searchHandler}>
            <div className={css.pic}></div>
            <input type="text"
              name="keyword"
              autoComplete="off"
              maxLength="20"
              placeholder={i18n.SEARCH_BAR_PLACEHOLDER()} />
          </form>
        </div>
    )
  }
}
