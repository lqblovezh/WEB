import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {TransitionMotion, spring, presets} from 'react-motion'

import CatalogPanel from '~/components/mobile/CatalogPanel'
import LabelPanel from '~/components/mobile/LabelPanel'
import BookmarkPanel from '~/components/mobile/BookmarkPanel'
import i18n from '~/i18n'
import classnames from 'classnames'

import css from './style.css'

const leftSideWidth = parseInt(window.innerWidth * 0.8);

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

  clickHandler = (type) => {
    this.props.toolStore.toggle(type);
  };

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
    } else if (toolStore.label.visible) {
      motionStyles.push({
        key: 'label',
        ...panelStyle,
      })
    } else if (toolStore.bookmark.visible) {
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
                <SlideBox tabKey={key} onClickTab={this.clickHandler} style={key === 'catalog' && style}>
                  <CatalogPanel />
                </SlideBox>
                <SlideBox tabKey={key} onClickTab={this.clickHandler} style={key === 'label' && style}>
                  <LabelPanel />
                </SlideBox>
                <SlideBox tabKey={key} onClickTab={this.clickHandler} style={key === 'bookmark' && style}>
                  <BookmarkPanel />
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
  tabKey,
  children,
  onClickTab
}) => {
  return (
    <div className={css.slideBox} style={style || {
      display: 'none',
    }}
         onClick={evt => evt.stopPropagation()}
    >
      <ul className={css.topNav}>
        <li className={classnames({
          [css.navActive]: tabKey === 'catalog'
        })} onClick={() => onClickTab('catalog')}>{i18n.CATALOG()}</li>
        <li className={classnames({
          [css.navActive]: tabKey === 'label'
        })} onClick={() => onClickTab('label')}>{i18n.LABEL()}</li>
        <li className={classnames({
          [css.navActive]: tabKey === 'bookmark'
        })} onClick={() => onClickTab('bookmark')}>{i18n.BOOKMARK()}</li>
      </ul>

      {children}

    </div>
  )
})
