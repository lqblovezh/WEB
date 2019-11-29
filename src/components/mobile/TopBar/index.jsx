import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {TransitionMotion, spring} from 'react-motion'
import i18n from '~/i18n'

import css from './style.css'

const sideDistance = 100

@inject('settingStore', 'toolStore', 'bookStore', 'chapterStore', 'searchStore')
@observer
export default class TopBar extends Component {
  constructor(props) {
    super(props)
  }

  clickSearchHandler = () => {
    this.props.toolStore.toggle('search')
  };

  clickBackHandler = () => {
    this.props.toolStore.goBack()
  };

  willEnter = ({key}) => {
    return {
      top: -sideDistance
    }
  }

  willLeave = ({key}) => {
    return {
      top: spring(-sideDistance, {
        stiffness: 500,
        damping: 40
      })
    }
  }

  visible = false

  render() {
    const {
      chapterStore,
      bookStore,
      toolStore,
    } = this.props;

    const panelStyle = {
      style: {
        top: spring(0, {
          stiffness: 300,
          damping: 30,
        }),
      }
    }

    const motionStyles = []

    if (toolStore.toolBar.visible) {
      motionStyles.push({
        key: 'toolBar',
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
              <div className={css.wrapper} style={{
                display: panel ? 'block' : 'none',
              }} data-page={chapterStore.pageIndex}>
                <SlideBox style={key === 'toolBar' && style}>
                  <div className={css.backBtn} onClick={this.clickBackHandler}>{i18n.BACK()}</div>
                  <div className={css.title}>{bookStore.bookName}</div>
                  <div className={css.search} onClick={this.clickSearchHandler}></div>
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