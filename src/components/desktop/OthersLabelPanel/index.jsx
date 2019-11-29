import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS, runInAction } from 'mobx'
import classnames from 'classnames'
import moment from 'moment'

import css from './style.css'
import FloatBox from '~/components/desktop/FloatBox'
import MastLayer from '~/components/desktop/MastLayer'
import i18n from '~/i18n'

@inject('bookStore', 'toolStore', 'otherLabelStore','chapterStore')
@observer
export default class OtherLabelPanel extends Component {
  clickGoPageHandler(label){
    if (label) {
      this.props.bookStore.openLabel(label);
    } else {
      console.warn(i18n.NF_SECTION({xmlId}))
    }
  }

  changePage = (page)=>{
    const {
      otherLabelStore,
      bookStore ,
    } = this.props;
    otherLabelStore.getOtherLabels({bookId:bookStore.bookId,pageNumber:page});
  }

  renderPage(pages){
    if(!pages){
      return
    }
    let list = [];
    list.push(
      <span className={classnames({
        [css.page]:true,
      })} key="0" onClick={e=>this.changePage(1)}>首</span>
    )
    for(let i =1 ; i<=pages.countPage ; i++ ){
      list.push(<span className={classnames({
        [css.currPage]:i==pages.pageNumber,
        [css.page]:true,
      })} key={i} onClick={e=>this.changePage(i)}>{i}</span>)
    }
    list.push(
      <span className={classnames({
        [css.page]:true,
      })} key={pages.countPage+1}  onClick={e=>this.changePage(pages.countPage)}>末</span>
    )
    return (
      <div>
        <div className={css.pageList}>
          {list}
        </div>
      </div>
    )
  }
  renderMARK(mark){
    return toJS(mark).map((item,index) => {
      return (
        <div className={css.otherGroup} key={index}>
          {
            item.type == 1 && 
            <a title={"《"+item.bookName+"》" + item.selected} target="_blank" href={`${location.pathname}?bookId=${item.bookId}&chapterId=${item.chapterId}`} className={css.other}>
             《{item.bookName}》
            关键词：{item.selected}
            </a>  
          }
          {
            item.type == 2 && 
            <a target="_blank" className={css.other} href={item.url} >{item.name}</a>
          }
        </div>
      )
    })
  }
  renderLabelList() {
    const {
      bookStore,
      otherLabelStore,
      toolStore,
    } = this.props;
    if (otherLabelStore.otherLabels && otherLabelStore.otherLabels) {
      return otherLabelStore.otherLabels.map((item, index) => (
        <div key={index} className={css.itemFieldo}>
          <div className={css.otherlabelTitle}>
            <div  className={css.otherlabelName}>{item.userName}</div>
            <div  className={css.otherlabelType}>{item.userType}</div>
            <div  className={css.otherlabelTime}> { moment(new Date(item.create_time*1000)  ).format("YYYY-MM-DD") }</div>
          </div>
          <div className={css.userText}>
            {item.userText}
          </div>
          <div onClick={evt => this.clickGoPageHandler(item)} className={css.selectedTexto}>
            {item.selectedText}
          </div>
          { item.mark.length > 0 &&
            <div className={css.otherLabelLink}>
              <div className={css.otherLabelTitle}>佐证列表</div>
              {this.renderMARK(item.mark)}
            </div>
          }
        </div>
      ))
    }
    return (
      <div className={css.itemField}>
        <div className={css.noData}>{i18n.NO_OTHER_LABEL()}</div>
      </div>
    )
  }

  render() {
    return (
      <div className={classnames({
        [css.wrapper]:true,
        [css.wrapperTransform]:this.props.toolStore.othersLabel.visible,
      })}>
        <div className={css.title}>{i18n.OTHER_LABEL()}</div>
        <div className={css.content}>
          {this.renderLabelList()}
          { this.renderPage(this.props.otherLabelStore.pages)}
        </div>
      </div>
    )
    // return (
    //   <div>dsadsad</div>
    // )
  }



}
