import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {TransitionMotion, spring, presets} from 'react-motion'

import SettingPanel from '~/components/desktop/SettingPanel'
import CatalogPanel from '~/components/desktop/CatalogPanel'
import LabelPanel from '~/components/desktop/LabelPanel'
import Bookmark from '~/components/desktop/Bookmark'
import MastLayer from '~/components/desktop/MastLayer'
import css from './style.css'
import baseCSS from '../base.css'

const leftSideWidth = parseInt(baseCSS.leftSideWidth) + 1

@inject('settingStore', 'toolStore')
@observer
export default class LeftSide extends Component {
  constructor(props) {
    super(props)
  }

  willEnter = ({key}) => {
    return {
      left: -leftSideWidth
    }
  }

  willLeave = ({key}) => {
    return {
      left: spring(-leftSideWidth, {
        stiffness: 500,
        damping: 40
      })
    }
  }

  visible = false

  hideHandler = () => {
    this.props.toolStore.toggle(null)
  }

  render() {
    const {settingStore, toolStore} = this.props

    const panelStyle = {
      style: {
        left: spring(0, {
          stiffness: 300,
          damping: 30,
        }),
      }
    }

    const motionStyles = []

    if (toolStore.catalog.visible) {
      motionStyles.push({
        key: 'catalog',
        ...panelStyle,
      })
    } else if (toolStore.setting.visible) {
      motionStyles.push({
        key: 'setting',
        ...panelStyle,
      })
    } else if (toolStore.label.visible) {
      motionStyles.push({
        key: 'label',
        ...panelStyle,
      })
    }else  if(toolStore.othersLabel.visible){
      motionStyles.push({
        key: 'othersLabel',
        ...panelStyle,
      })
    }else  if(toolStore.bookmark.visible){
      motionStyles.push({
        key: 'bookmark',
        ...panelStyle,
      })
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
            const {key, style} = (panel || {})
            return (
              <div className={css.wrapper}
                style={{
                  display: panel ? 'block' : 'none',
                }}
                onClick={this.hideHandler}
              >
                <SlideBox style={key === 'catalog' && style}>
                  <CatalogPanel />
                </SlideBox>
                <SlideBox style={key === 'setting' && style}>
                  <SettingPanel />
                </SlideBox>
                <SlideBox style={key === 'label' && style}>
                  <LabelPanel />
                </SlideBox>
                <SlideBox style={key === 'bookmark' && style}>
                  <Bookmark/>
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
}) => (
  <div className={css.slideBox} style={style || {
      display: 'none',
    }}
    onClick={evt => evt.stopPropagation()}
  >
    {children}
  </div>
))
