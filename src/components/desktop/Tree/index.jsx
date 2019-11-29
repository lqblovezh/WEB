import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, computed, runInAction} from 'mobx'
import classnames from 'classnames'

import css from './style.css'

@inject('chapterStore', 'bookStore')
@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {bookStore} = this.props

    return (<div className={css.wrapper}>
      <div className={css.bookName}>
        {bookStore.bookName}
      </div>
      <Menu {...this.props} menus={bookStore.menus} visible={true}/>
    </div>)
  }
}

@inject('chapterStore', 'bookStore')
@observer
class Menu extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      visible,
      rootId = '',
      menus,
      chapterStore,
      bookStore,
    } = this.props

    return (<ul className={css.menu} style={{
        display: visible
          ? 'block'
          : 'none'
      }}>
      {
        menus && menus.map((menu) => {
          const status = bookStore.getMenuStatus(menu, rootId)
          return (<li key={menu.chapter_id}>
            <div className={classnames({
                [css.itemAction]: status.active,
                [css.item]: true
              })} title={menu.chapter_name}>

              {
                menu.menu.length > 0
                  ? <button className={css.toggleBtn} onClick={evt => {
                        evt.preventDefault()
                        bookStore.toggleMenu(menu, rootId)
                      }}>{
                        status.visible
                          ? '[-]'
                          : '[+]'
                      }</button>
                  : null
              }

              <div className={classnames({
                [css.name]: true
              })} onClick={() => {
                  bookStore.openMenu(menu, rootId)
                }}>{menu.chapter_name}</div>

            </div>
            {
              menu.menu.length > 0
                ? <Menu {...this.props}
                  menus={menu.menu}
                  visible={status.visible}
                  rootId={rootId || menu.chapter_id}/>
                : null
            }
          </li>)
        })
      }
    </ul>)
  }
}
