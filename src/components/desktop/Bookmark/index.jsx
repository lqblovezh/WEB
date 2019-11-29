import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS, runInAction } from 'mobx'
import classnames from 'classnames'
import moment from 'moment'

import css from './style.css'
import FloatBox from '~/components/desktop/FloatBox'
import MastLayer from '~/components/desktop/MastLayer'
import i18n from '~/i18n'

@inject('bookStore', 'toolStore', 'labelStore', 'chapterStore','bookmarkStore')
@observer
export default class Bookmark extends Component {

  renderLabelList() {
    const {
      bookStore,
      labelStore,
      toolStore,
      bookmarkStore,
    } = this.props;
    
    console.log(bookmarkStore.bookmarkGroup);
    const list = bookmarkStore.bookmarkGroup.map((item,index)=>{
      return (
        <div className={css.bookmarkItem} key={index}>
          <div title={item.chapterName} className={css.bookmarkChapter}>
            第{index+1}章<span className={css.bookmarkChapterName}>{item.chapterName}</span>
          </div>
          {
            item.bookmarks.map((markitem,indexmark)=>{
              return (
                <div className={css.mark} key={indexmark+index}>
                  <div className={css.markTop}>
                    <span>{ moment(new Date(markitem.create_time*1000)  ).format("YYYY-MM-DD HH:mm") }</span>
                    <span className={css.markDel} onClick={e=>bookmarkStore.removeBookmark(markitem.id) }> </span>
                  </div>
                  <div onClick={e=>bookStore.openLabel(markitem)}  title={ markitem.selectedText } className={css.markContent}>
                    { markitem.selectedText }
                  </div>
                </div>
              )
            })
          }
            
        </div>
      )
    })

    return (
      <div>
        {
          bookmarkStore.bookmarkGroup &&  list
        }
      </div>
    )
  }

  render() {
    return (
      <div className={css.wrapper}>
        <div className={css.title}>{i18n.BOOKMARK()}</div>
        <div className={css.content}>
          {this.renderLabelList()}
        </div>
      </div>

    )
  }

}
