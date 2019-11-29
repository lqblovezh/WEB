import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import classnames from 'classnames'

import css from './style.css'

@inject('settingStore','bookStore')
@observer
export default class SettingPanel extends Component {
    renderFontSize() {
        const { settingStore } = this.props;
        return settingStore.fontSizeList.map((item, index) => {
            return (
                <div className={classnames({
                    [css.fontSizeListItem]: true,
                    [css.activeFontSize]: index === settingStore.fontSizeIndex,
                })}
                    onClick={evt => settingStore.changeFontSizeIndex(index)} key={index} style={{ fontSize: item.value }}>
                    <a value={item.value}>A</a>
                </div>)
        })

    }
    renderFontFamily() {
        const { settingStore } = this.props;
        return settingStore.fontFamilyList.map((item, index) => {
            return (
                <div onClick={evt => settingStore.changeFontFamilyIndex(index)} className={css.fontFamilyListItem} key={index}>
                    <a >{item.title}</a> <div className={classnames({
                        [css.solidCircle]: index === settingStore.fontFamilyIndex,
                        [css.hollowCircle]: index !== settingStore.fontFamilyIndex,
                    })}></div>
                </div>)
        })

    }
    renderBackground() {
        const { settingStore } = this.props;
        return settingStore.colorAndBgList.map((item, index) => {
            return (
                <div onClick={evt => settingStore.changeBgColorIndex(index)} className={css.bgColorListItem} key={index}>
                    <div className={classnames({
                        [css.bgCircle]: true,
                        [css.activebgCircle]: index === settingStore.colorAndBgIndex,
                        [item.value[2] || '']: item.value.length > 2,
                    })} style={{
                      color: item.value[0],
                      backgroundColor: item.value[1],
                    }} ></div>
                    {item.title}
                </div>)
        })
    }
    renderLayout() {
        const { settingStore,bookStore} = this.props;
        var testindex = 2;
        return (
            <div className={css.LayoutBtnWrap}>
                {settingStore.layoutBtns.map((item, index) => {
                    return <div key={index}
                    onClick={evt => bookStore.setTextLayout(item.textLayout)}
                    className={classnames({
                        [css[item.className]]: true,
                        [css.layoutActiveBtn]: item.textLayout === bookStore.textLayout,
                    })}></div>
                })}
            </div>
        )
    }

    render() {
        const {
          bookStore,
          settingStore,
        } = this.props;
        return (
            <div className={css.wrapper}>
                <div className={css.content} >
                    <div className={css.setFiled}>
                        <div className={css.fieldTitle}>字体大小</div>
                        <div className={css.fontSizeList}>
                            {this.renderFontSize()}
                        </div>
                    </div>
                    <div className={css.setFiled}>
                        <div className={css.fieldTitle}>字体设置</div>
                        <div className={css.fontFamilyList}>
                            {this.renderFontFamily()}
                        </div>
                    </div>
                    <div className={css.setFiled}>
                        <div className={css.fieldTitle}>颜色设置</div>
                        <div className={css.colorAndBgList}>
                            {this.renderBackground()}
                        </div>
                    </div>

                    {
                      bookStore.bookCategory === 'guji' && (
                        <div className={css.setFiled}>
                            <div className={css.fieldTitle}>排版设置</div>
                            <div className={css.colorAndBgList}>
                                {this.renderLayout()}
                            </div>
                        </div>
                      )
                    }

                </div>
            </div>
        )
    }
}
