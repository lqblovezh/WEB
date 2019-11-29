import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import classnames from 'classnames'

import css from './style.css'

@inject('settingStore', 'bookStore', 'toolStore')
@observer
export default class FontPanel extends Component {
  renderFontFamily() {
    const {settingStore} = this.props;
    return settingStore.fontFamilyList.map((item, index) => {
      return (
        <div onClick={evt => settingStore.changeFontFamilyIndex(index)} className={css.fontFamilyListItem} key={index}>
          <a >{item.title}</a>
          <div className={classnames({
            [css.solidCircle]: index === settingStore.fontFamilyIndex,
          })}></div>
        </div>)
    })
  }

  clickBackHandler = () => {
    this.props.toolStore.showToolBar('setting')
  };

  render() {
    const {
      bookStore,
      settingStore,
    } = this.props;
    return (
      <div className={css.wrapper}>
        <div className={css.fieldTitle}>
          <div className={css.back} onClick={this.clickBackHandler}></div>
          字体
        </div>
        <div className={css.fontFamilyList}>
          {this.renderFontFamily()}
        </div>
      </div>
    )
  }
}
