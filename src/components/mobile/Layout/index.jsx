import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import urlParse from 'url-parse'

import css from './style.css'
import classnames from 'classnames'

import {addEvent, removeEvent} from '~/utils/event'
import {Storage} from '~/utils/Storage'
import GestureGuide from '~/components/mobile/GestureGuide'
import MastLayer from '~/components/mobile/MastLayer'
import LoadingIcon from '~/components/mobile/LoadingIcon'
import MainBody from '~/components/mobile/MainBody'
import TopBar from "~/components/mobile/TopBar"
import BottomBar from '~/components/mobile/BottomBar'
import TextToolBar from '~/components/mobile/TextToolBar'
import LeftSide from '~/components/mobile/LeftSide'
import SearchSide from '~/components/mobile/SearchSide'
import OthersLabelPanel from '~/components/mobile/OthersLabelPanel'

const version = __VERSION__
const gestureGuide = new Storage(localStorage, 'gestureGuide')
const isRunGuide = gestureGuide.getValue() !== version

@inject('layoutStore', 'loadingStore', 'bookStore', 'toolStore', 'textToolStore', 'otherLabelStore')
@observer
export default class Layout extends Component {
  constructor(props) {
    super(props)
  }

  @observable isRunGuide = true

  componentDidMount() {
    const {
      bookStore,
      params,
    } = this.props

    if (params) {
      bookStore.openBook(params).catch(e => alert(e.toString()))
    }
  }

  panelHandle = () => {
    const {
      toolStore,
    } = this.props
    return toolStore.bottomBar.visible || toolStore.setting.visible || toolStore.fontFamily.visible
  }

  @action panelClickHandle = () => {
    this.isRunGuide = false;
    gestureGuide.setValue(version);
  }

  render() {
    const {
      layoutStore,
      loadingStore,
      textToolStore,
      otherLabelStore,
    } = this.props

    const {
      otherLabels,
      settings:{
        otherLabelEnabled,
      }
    } = otherLabelStore


    return (
      <div className={classnames({
        [css.wrapper]: true,
        [css.daytime]: layoutStore.brightness > 0,
        [css.nighttime]: layoutStore.brightness < 1,
      })} style={{
        fontSize: layoutStore.convertPXtoREM(16),
      }}>
        <TopBar/>
        <LeftSide/>
        <div className={css.container}>
          <MainBody/>
        </div>
        <SearchSide />
        <BottomBar/>
        {
          textToolStore.visible && <TextToolBar />
        }
        {
          (!loadingStore.visible && isRunGuide && this.isRunGuide) && (
            <MastLayer keepBlur={true}>
              <GestureGuide onClick={this.panelClickHandle}/>
            </MastLayer>
          )
        }
        {
          loadingStore.visible && (
            <MastLayer keepBlur={true}>
              <LoadingIcon />
            </MastLayer>
          )
        }
        {
          otherLabelEnabled && otherLabels && (
            <OthersLabelPanel />
          )
        }
      </div>
    )
  }
}
