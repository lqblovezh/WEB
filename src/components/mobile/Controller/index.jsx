import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS, computed} from 'mobx'

import css from './style.css'
import classnames from 'classnames'
import baseCSS from '../base.css'

import {addEvent, removeEvent} from '~/utils/event'

const progressBtnWidth = 16;

@inject('layoutStore', 'loadingStore', 'bookStore')
@observer
export default class Controller extends Component {
  constructor(props) {
    super(props)
  }

  @computed get left (){
    return `${this.props.percent*100}%`
  }

  touch = {}

  touchStart = (e) => {
    this.touch.initiated = true;
    this.touch.startX = e.touches[0].pageX;
    this.touch.left = this.refs.progress.clientWidth;
  };

  touchMove = (e) => {
    if (!this.touch.initiated) {
      return;
    }
    const deltaX = e.touches[0].pageX - this.touch.startX;
    const offsetWidth = Math.min(this.refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX));
    const left = `${offsetWidth/this.refs.progressBar.clientWidth*100}%`
    this.refs.progress.style.width = left;
    this.refs.progressBtnWrapper.style.left = left;
  };

  touchEnd = () => {
    this.touch.initiated = false;
    this.triggerPercent();
  };

  progressClick = (e) => {
    const rect = this.refs.progressBar.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left - progressBtnWidth / 2;
    this.offset(offsetWidth);
    this.triggerPercent();
  }

  offset(offsetWidth) {
    const left = `${offsetWidth/this.refs.progressBar.clientWidth*100}%`;
    this.refs.progress.style.width = left;
    this.refs.progressBtnWrapper.style.left = left;
  }

  triggerPercent = () => {
    const percent = this.refs.progress.clientWidth / (this.refs.progressBar.clientWidth - progressBtnWidth);
    this.props.onPercentChange(percent);
  }

  render() {
    const {
      layoutStore,
    } = this.props

    return (
      <div className={css.wrapper}>
        <div className={classnames({
          [css.lastChapter]: true,
          [css.Chapter]: true,
          [css.lessFlex]: (this.props.firstText ? this.props.firstText.length : 0) < 2
        })}
        onClick={this.props.onFirstClick}
        >{this.props.firstText}</div>
        <div className={css.progressBarWrapper}>
          <div className={css.progressBar} ref='progressBar' onClick={this.progressClick}>
            <div className={css.barInner}>
              <div className={css.progress} ref='progress' style={{
                width: this.left
              }}></div>
              <div className={css.progressBtnWrapper}
                   ref='progressBtnWrapper'
                   onTouchStart={this.touchStart}
                   onTouchMove={this.touchMove}
                   onTouchEnd={this.touchEnd}
                   style={{
                     left: this.left
                   }}
              >
                <div className={css.progressBtn}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={classnames({
          [css.nextChapter]: true,
          [css.Chapter]: true,
          [css.lessFlex]: (this.props.lastText ? this.props.lastText.length : 0) < 2
        })}
        onClick={this.props.onLastClick}
        >{this.props.lastText}</div>
      </div>
    )
  }
}
