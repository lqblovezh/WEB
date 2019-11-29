import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import classnames from 'classnames'
import Controller from '~/components/mobile/Controller'
import i18n from '~/i18n'

import css from './style.css'

@inject('settingStore', 'bookStore', 'toolStore', 'layoutStore', 'chapterStore')
@observer
export default class SettingPanel extends Component {
  renderBackground() {
    const {settingStore} = this.props;
    return settingStore.colorAndBgList.map((item, index) => {
      return (
        <div onClick={evt => settingStore.changeBgColorIndex(index)} className={css.bgColorListItem} key={index}>
          <div className={classnames({
            [css.bgDefault]: index === settingStore.colorAndBgIndex,
            [item.value[2] || '']: item.value.length > 2,
          })} style={{
            color: item.value[0],
            backgroundColor: item.value[1],
          }}></div>
        </div>)
    })
  }

  clickFontHandler = () => {
    this.props.toolStore.showToolBar('fontFamily')
  };

  percentChangeHandler = (percent) => {
    const {chapterStore} = this.props
    chapterStore.percent = percent
    console.log(chapterStore.percent);
  }

  render() {
    const {
      settingStore,
      layoutStore,
    } = this.props;
    const {
      fontFamilyName,
      fontSizeName,
      fontSizeIndex,
      changeFontSizeIndex,
    } = settingStore
    return (
      <div className={css.wrapper}>
        <div className={css.content}>
          <div className={css.brightness}>
            <Controller firstText={i18n.DARK()} lastText={i18n.BRIGHT()} onPercentChange={this.percentChangeHandler}/>
            <div className={css.systemLight}>
              <div>{i18n.SYSTEM()}</div>
              <div className={css.ligthDefault}>{i18n.ALWAYS()}</div>
            </div>
          </div>
          {
            layoutStore.brightness > 0 && (
              <div className={css.colorAndBgList}>
                {this.renderBackground()}
              </div>
            )
          }
          <div className={css.fontList}>
            <div className={css.fontSize}>
              <div className={`${css.reduceSize} ${css.sizeBtn}`}
                   onClick={() => changeFontSizeIndex(fontSizeIndex - 1)}></div>
              <div className={css.size}>{fontSizeName}</div>
              <div className={`${css.addSize} ${css.sizeBtn}`}
                   onClick={() => changeFontSizeIndex(fontSizeIndex + 1)}></div>
            </div>
            <div className={css.fontFamily} onClick={this.clickFontHandler}>
              {fontFamilyName}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
