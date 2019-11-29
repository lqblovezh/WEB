import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {TransitionMotion, spring, presets} from 'react-motion'

import SettingPanel from '~/components/mobile/SettingPanel'
import FontPanel from '~/components/mobile/FontPanel'
import Controller from '~/components/mobile/Controller'
import NavBar from '~/components/mobile/NavBar'
// import MastLayer from '~/components/mobile/MastLayer'
import i18n from '~/i18n'

import css from './style.css'
import baseCSS from '../base.css'

const sideDistance = 300

@inject('settingStore', 'toolStore', 'chapterStore')
@observer
export default class BottomBar extends Component {
  constructor(props) {
    super(props)
  }

  willEnter = ({key}) => {
    return {
      bottom: -sideDistance
    }
  }

  willLeave = ({key}) => {
    return {
      bottom: spring(-sideDistance, {
        stiffness: 500,
        damping: 40
      })
    }
  }

  visible = false

  hideHandler = () => {
    this.props.toolStore.toggle(null)
  }

  percentChangeHandler = (percent) => {
    const {chapterStore} = this.props
    chapterStore.percent = percent
    chapterStore.goPage(chapterStore.percentPageIndex)
  }

  render() {
    const {toolStore, chapterStore} = this.props

    const panelStyle = {
      style: {
        bottom: spring(0, {
          stiffness: 300,
          damping: 30,
        }),
      }
    }

    const motionStyles = []

    if (toolStore.toolBar.visible) {
      if (toolStore.toolBar.setting.visible) {
        motionStyles.push({
          key: 'setting',
          ...panelStyle,
        })
      } else if (toolStore.toolBar.fontFamily.visible) {
        motionStyles.push({
          key: 'fontFamily',
          ...panelStyle,
        })
      } else {
        motionStyles.push({
          key: 'bottomBar',
          ...panelStyle,
        })
      }
    }

    let willEnter, willLeave

    const visible = motionStyles.length > 0

    if (this.visible) {
      if (!visible) {
        willLeave = this.willLeave
      }
    } else {
      if (visible) {
        willEnter = this.willEnter
      }
    }

    this.visible = visible

    return (
      <TransitionMotion
        willEnter={willEnter}
        willLeave={willLeave}
        styles={motionStyles}>
        {
          settings => {
            const panel = settings[0]
            const {key, style} = (panel || {});
            return (
              <div className={css.wrapper}
                   style={{
                     display: panel ? 'block' : 'none',
                   }}
                   onClick={this.hideHandler}
              >
                <SlideBox style={key === 'bottomBar' && style}>
                  <div className={css.chapter}>
                    <Controller
                      firstText={i18n.LAST_CHAPTER()}
                      onPercentChange={this.percentChangeHandler}
                      percent={chapterStore.percent}
                      lastText={i18n.NEXT_CHAPTER()}
                      onFirstClick={chapterStore.prevChapter}
                      onLastClick={chapterStore.nextChapter}
                    />
                  </div>
                  <NavBar />
                </SlideBox>
                <SlideBox style={key === 'setting' && style}>
                  <SettingPanel />
                </SlideBox>
                <SlideBox style={key === 'fontFamily' && style}>
                  <FontPanel />
                </SlideBox>
              </div>
            )
          }
        }
      </TransitionMotion>
    )
  }
}

const SlideBox = observer(({
  style,
  children,
}) => {
  return (
    <div className={css.slideBox} style={style || {
      display: 'none',
    }}
         onClick={evt => evt.stopPropagation()}
    >
      {children}
    </div>
  )
});
