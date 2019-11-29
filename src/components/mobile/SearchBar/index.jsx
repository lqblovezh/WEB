import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import classnames from 'classnames'

import i18n from '~/i18n'
import css from './style.css'

@inject('searchStore')
@observer
export default class SearchBar extends Component {
  constructor(props) {
    super(props)
  }

  searchHandler = (evt) => {
    evt.preventDefault()
    const {
      searchStore
    } = this.props
    const val = evt.target.keyword ? evt.target.keyword.value : evt.target.parentNode.keyword.value;
    if (!val) {
      return
    }

    searchStore.keyword = val
    searchStore.search({"pagesIndex": 1, append: true}).then(() => {
      if(searchStore.scroll){
        searchStore.scroll.finishPullUp();
        searchStore.scroll.refresh();
      }
    })
  }

  render() {
    return (
      <div className={css.wrapper}>
        <div className={css.box}>
          <form onSubmit={ this.searchHandler }>
            <div className={css.pic} onClick={ this.searchHandler }></div>
            <input type="text"
                   name="keyword"
                   autoComplete="off"
                   maxLength="20"
                   placeholder={i18n.SEARCH_BAR_PLACEHOLDER()}/>
          </form>
        </div>
      </div>
    )
  }
}
