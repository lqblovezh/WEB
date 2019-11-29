import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS, runInAction} from 'mobx'
import {TransitionMotion, spring, presets} from 'react-motion'
import BScroll from 'better-scroll'
import classnames from 'classnames'
import moment from 'moment'

import css from './style.css'
import i18n from '~/i18n'

const leftSideWidth = parseInt(window.innerWidth * 0.8);

@inject('bookStore', 'toolStore', 'otherLabelStore', 'chapterStore')
@observer
export default class OtherLabelPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const {
      otherLabelStore
    } = this.props;
    setTimeout(() => {
      otherLabelStore.scroll.refresh();
    }, 20)
  }

  componentDidMount() {
    const {
      otherLabelStore
    } = this.props;

    otherLabelStore.scroll = new BScroll(`.${css.content}`, {
      click: true,
      pullUpLoad: true,
      observeDOM: false,
      probeType: 1,
    });

    otherLabelStore.scroll.on('pullingUp', () => {
      const {
        pages,
        pageNum,
        currentDate,
      } = otherLabelStore;

      if (!currentDate.length || pages.pageSize * pages.pageNumber >= pages.totalCount) {
        return console.log('这是最后一条!');
      }

      otherLabelStore.getOtherLabels({pageNumber: pageNum + 1, append: true}).then(() => {
        otherLabelStore.scroll.finishPullUp();
        otherLabelStore.scroll.refresh();
      });
    })
  }

  clickGoPageHandler(label) {
    if (label) {
      this.props.bookStore.openLabel(label);
    } else {
      console.warn(i18n.NF_SECTION({xmlId}))
    }
  }

  willEnter = ({key}) => {
    return {
      left: -leftSideWidth
    }
  };

  willLeave = ({key}) => {
    return {
      left: spring(-leftSideWidth, {
        stiffness: 500,
        damping: 40
      })
    }
  };

  hideHandler = () => {
    this.props.toolStore.toggle(null)
  }

  visible = false;

  renderMARK(mark) {
    return toJS(mark).map((item, index) => {
      return (
        <div className={css.otherGroup} key={index}>
          {
            item.type == 1 &&
            <a target="_blank" href={`${location.pathname}?bookId=${item.bookId}`}
               className={css.other}>{item.bookName}</a>
          }
          {
            item.type == 2 &&
            <a target="_blank" className={css.other} href={item.url}>{item.name}</a>
          }
        </div>
      )
    })
  }

  renderLabelList() {
    const {
      otherLabelStore,
    } = this.props;
    if (otherLabelStore.otherLabels && otherLabelStore.otherLabels.length) {
      return otherLabelStore.otherLabels.map((item, index) => (
        <div key={index} className={css.itemFieldo}>
          <div className={css.otherlabelTitle}>
            <div className={css.otherlabelName}>{item.userName}</div>
            <div className={css.otherlabelType}>{item.userType}</div>
            <div
              className={css.otherlabelTime}> { moment(new Date(item.create_time * 1000)).format("YYYY-MM-DD") }</div>
          </div>
          <div className={css.userText}>
            {item.userText}
          </div>
          <div onClick={evt => this.clickGoPageHandler(item)} className={css.selectedTexto}>
            {item.selectedText}
          </div>
          { item.mark.length > 0 &&
          <div className={css.otherLabelLink}>
            <div className={css.otherLabelTitle}>{i18n.OTHER_LABEL_LIST()}</div>
            {this.renderMARK(item.mark)}
          </div>
          }
        </div>
      ))
    }
    return (
      <div className={css.itemField}>
        <div className={css.noData}>{i18n.NO_OTHER_LABEL()}</div>
      </div>
    )
  }

  render() {
    const {toolStore, searchStore} = this.props;
    const panelStyle = {
      style: {
        left: spring(0, {
          stiffness: 300,
          damping: 30,
        }),
      }
    };
    const motionStyles = [];
    if (toolStore.othersLabel.visible) {
      motionStyles.push({
        key: 'othersLabel',
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
                   style={{
                     display: panel ? 'block' : 'none',
                   }}
                   onClick={this.hideHandler}
              >
                <SlideBox style={key === 'othersLabel' && style}>
                  <div className={css.title}>{i18n.OTHER_LABEL()}</div>
                  <div className={css.content}>
                    <div>
                      {this.renderLabelList()}
                    </div>
                  </div>
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
      display: 'block',
    }}
         onClick={evt => evt.stopPropagation()}
    >
      {children}

    </div>
  )
});
