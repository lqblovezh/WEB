import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS, runInAction} from 'mobx'
import classnames from 'classnames'
import moment from 'moment'

import css from './style.css'
import FloatBox from '~/components/desktop/FloatBox'
import MastLayer from '~/components/desktop/MastLayer'
import i18n from '~/i18n'

@inject('bookStore', 'toolStore', 'labelStore', 'chapterStore')
@observer
export default class LabelPanel extends Component {

  TempUserText = {id: null, userText: null};

  saveTempUserText(evt, index) {
    if (evt.target.value) {
      this.TempUserText.userText = evt.target.value;
      this.TempUserText.id = index;
    }
  }

  clickSubmitHandler(item) {

    if (item.id === this.TempUserText.id && item.userText !== this.TempUserText.userText) {
      this.props.labelStore.modifyLabel(this.TempUserText)
    }
  }

  clickDeleteHandler(item) {
    if (confirm(i18n.LABEL_DELETE_CONFIRM())) {
      this.props.labelStore.removeLabels([item])
    }

  }

  clickGoPageHandler(label) {
    if (label) {
      this.props.bookStore.openLabel(label);
    } else {
      console.warn(i18n.NF_SECTION({xmlId}))
    }
  }

  renderLabelList() {

    const {
      bookStore,
      labelStore,
      toolStore,
    } = this.props;

    if (bookStore.labels && bookStore.labels.length) {
      return bookStore.labels.map((item, index) => (
        <div key={index} className={css.itemField}>
          <div className={css.labelTitle}>
            <div className={css.btnList}>
              <span className={css.upLabelBtn} onClick={e => this.clickDeleteHandler(item)}>{i18n.DELETE()}</span>
            </div>
            {`《${bookStore.bookName}》 ${item.chapterName || ''}`}
          </div>
          <div onClick={evt => this.clickGoPageHandler(item)} className={css.selectedText}>
            {item.selectedText}
          </div>
          <div className={css.userText}>
            {item.userText}
          </div>
          <div className={css.labelTime}>
            { moment(new Date(item.create_time * 1000)).format("YYYY-MM-DD HH:mm") }
          </div>
        </div>
      ))
    }

    return (
      <div className={css.itemField}>
        <div className={css.noData}>{i18n.NF_LABEL_DESKTOP()}</div>
      </div>
    )
  }

  render() {
    return (
      <div className={css.wrapper}>
        <div className={css.title}>{i18n.LABEL()}</div>
        <div className={css.content}>
          {this.renderLabelList()}
        </div>
      </div>

    )
  }


}
