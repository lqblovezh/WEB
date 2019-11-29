import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import i18n from '~/i18n'

import classnames from 'classnames'

import css from './style.css'

import {addEvent, removeEvent} from '~/utils/event'

@inject('layoutStore', 'loadingStore', 'bookStore', 'toolStore')
@observer
export default class NavBar extends Component {
  constructor(props) {
    super(props)
  }

  clickCatalogHandler = () => {
    this.props.toolStore.toggle('catalog')
  };

  clickSettingHandler = () => {
    this.props.toolStore.showToolBar('setting')
  };

  clickBrightnessHandler = () => {
    const {layoutStore} = this.props;
    layoutStore.toggleBrightness();
  };

  render() {
    const {layoutStore} =this.props;
    return (
      <ul className={css.wrapper}>
        <li className={css.catalog} onClick={this.clickCatalogHandler}>{i18n.CATALOG()}</li>
        <li className={css.white}
            onClick={this.clickBrightnessHandler}>{i18n.BRIGHTNESS({type: layoutStore.brightness})}</li>
        <li className={css.setting} onClick={this.clickSettingHandler}>{i18n.SETTING()}</li>
        <li className={css.share} onClick=''>{i18n.SHARE()}</li>
      </ul>
    )
  }
}
