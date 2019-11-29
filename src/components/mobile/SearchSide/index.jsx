import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {TransitionMotion, spring, presets} from 'react-motion'

import SearchBar from '~/components/mobile/SearchBar'
import SearchResultBox from '~/components/mobile/SearchResultBox'

import i18n from '~/i18n'
import classnames from 'classnames'

import css from './style.css'

const rightSideWidth = parseInt(window.innerWidth * 0.8);

@inject('settingStore', 'toolStore', 'searchStore')
@observer
export default class SearchSide extends Component {
  constructor(props) {
    super(props)
  }

  willEnter = ({key}) => {
    return {
      right: -rightSideWidth
    }
  };

  willLeave = ({key}) => {
    return {
      right: spring(-rightSideWidth, {
        stiffness: 500,
        damping: 40
      })
    }
  };

  visible = false;

  hideHandler = () => {
    this.props.toolStore.toggle(null)
  };

  clickHandler = (type) => {
    this.props.toolStore.toggle(type);
  };

  render() {
    const {toolStore, searchStore} = this.props;
    const panelStyle = {
      style: {
        right: spring(0, {
          stiffness: 300,
          damping: 30,
        }),
      }
    };
    const motionStyles = [];
    if (toolStore.search.visible) {
      motionStyles.push({
        key: 'search',
        ...panelStyle,
      })
    }
    let willEnter, willLeave;
    const visible = motionStyles.length > 0;
    if (this.visible) {
      if (!visible) {
        willLeave = this.willLeave
      }
    } else {
      if (visible) {
        willEnter = this.willEnter
      }
    }
    this.visible = visible;
    return (
      <TransitionMotion
        willEnter={willEnter}
        willLeave={willLeave}
        styles={motionStyles}>
        {
          settings => {
            const panel = settings[0];
            const {key, style} = (panel || {});
            return (
              <Observer>{() => (
                <div className={css.wrapper}
                  // display: panel ? 'block' : 'none',
                     style={{
                       display: panel ? 'block' : 'none',
                     }}
                     onClick={this.hideHandler}
                >
                  <SlideBox style={key === 'search' && style}>
                    <SearchBar />
                    <SearchResultBox />
                  </SlideBox>
                </div>
              )}</Observer>
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
