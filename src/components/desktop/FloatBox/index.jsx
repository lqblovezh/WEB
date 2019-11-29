import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, computed, action, runInAction, toJS } from 'mobx'
import Draggable from 'react-draggable'
import offset from 'global-offset'
import computedStyle from 'computed-style'

import {
  addEvent,
  removeEvent,
} from '~/utils/event'

import css from './style.css'

const cursorOffset = 2
const borderWidth = parseInt(css.borderWidth)

@inject('layoutStore')
@observer
export default class FloatBox extends Component {
  constructor (props) {
    super(props)
    const {
      defaultWidth,
      defaultHeight,
      minWidth,
      minHeight,
      align,
      title,
      closeHandler,
    } = props

    this.width = defaultWidth - borderWidth * 2
    this.height = defaultHeight - borderWidth * 2

    this.minWidth = minWidth
    this.minHeight = minHeight

    this.title = title;
    this.closeHandler = closeHandler;

    if (align === 'center') {
      if (this.maxWidth > this.width) {
        this.left = Math.floor((this.maxWidth - this.width) / 2)
      }
      if (this.maxHeight > this.height) {
        this.top = Math.floor((this.maxHeight - this.height) / 2)
      }
    }
  }

  static defaultProps = {
    minWidth: 100,
    minHeight: 100,
    align: 'left',
  }


  componentDidMount () {
    addEvent(document, 'mousedown', this.mouseDownHandler)
    addEvent(document, 'mousemove', this.mouseMoveHandler)
    addEvent(document, 'mouseup', this.mouseUpHandler)
  }

  componentWillUnmount () {
    removeEvent(document, 'mousedown', this.mouseDownHandler)
    removeEvent(document, 'mousemove', this.mouseMoveHandler)
    removeEvent(document, 'mouseup', this.mouseUpHandler)
  }

  @observable cursor = 'inherit'
  @observable width = 0
  @observable height = 0
  @observable left = 10
  @observable top = 10

  @observable movable = false
  @computed get bounds () {
    return {
      left: -this.left,
      top: -this.top,
      right: this.maxWidth - this.width - borderWidth * 2,
      bottom: this.maxHeight - this.height - borderWidth * 2,
    }
  }

  get maxWidth () {
    return this.props.layoutStore.mainBodyBox.width
  }

  get maxHeight () {
    return this.props.layoutStore.mainBodyBox.height
  }

  minWidth = null

  minHeight = null

  resizable = false

  cursorPosition = null

  startX = null

  startY = null

  startWidth = null

  startHeight = null

  startTop = null

  startLeft = null

  boxEl = null

  headerEl = null

  title = null

  closeHandler = null



  mouseDownHandler = (evt) => {
    if (this.cursor !== 'inherit') {
        evt.stopPropagation()
        evt.preventDefault()

        this.startX = evt.clientX
        this.startY = evt.clientY

        this.startWidth = this.width
        this.startHeight = this.height

        this.startTop = parseInt(computedStyle(this.boxEl, 'top'))
        this.startLeft = parseInt(computedStyle(this.boxEl, 'left'))

        this.resizable = true
    }
  }

  mouseMoveHandler = (evt) => {
    if (this.resizable) {
        let width, height
        let left = null, top = null
        const offsetX = evt.clientX - this.startX
        const offsetY = evt.clientY - this.startY
        switch(this.cursorPosition) {
          case 'right':
            width = this.startWidth + offsetX
            break
          case 'bottom':
            height = this.startHeight + offsetY
            break
          case 'rightBottom':
            width = this.startWidth + offsetX
            height = this.startHeight + offsetY
            break
        }

        runInAction(() => {
          if (width > this.minHeight && width < this.maxWidth) {
            this.width = width
            if (left !== null) {
              this.left = left
            }
          }

          if (height > this.minHeight && height < this.maxHeight) {
            this.height = height
            if (top !== null) {
              this.top = top
            }
          }
        })
        return
    }

    const {
      left, top
    } = offset(this.boxEl)

    const offsetX = evt.clientX - left
    const offsetY = evt.clientY - top

    const insideWidth = cursorOffset
    const outsideWidth = borderWidth + cursorOffset

    runInAction(() => {
      if (offsetX < this.width + outsideWidth && offsetX > this.width - insideWidth) {
        if (offsetY < this.height + outsideWidth && offsetY > this.height - insideWidth) {
          this.cursor = 'nwse-resize'
          this.cursorPosition = 'rightBottom'
        } else {
          this.cursor = 'col-resize'
          this.cursorPosition = 'right'
        }
      } else if (offsetY < this.height + outsideWidth && offsetY > this.height - insideWidth) {
        this.cursor = 'row-resize'
        this.cursorPosition = 'bottom'
      } else {
        this.cursor = 'inherit'
        this.cursorPosition = null
      }
    })
  }

  mouseUpHandler = () => {
    this.resizable = false
  }

  moveStartHandler = (evt) => {
    if (evt.target ===  this.headerEl) {
      evt.preventDefault()
      runInAction(() => {
        this.movable = true
      })
    }
  }

  moveStopHandler = (evt) => {
    runInAction(() => {
      this.movable = false
    })
  }

  render() {
      return (
        <Draggable
          disabled={!this.movable}
          onStop={this.moveStopHandler}
        >
          <div className={css.wrapper}
            ref={el => this.boxEl = el}
            style={{
              width: this.width + 'px',
              height: this.height + 'px',
              cursor: this.cursor,
              left: this.left + 'px',
              top: this.top + 'px',
            }}
          >
            <div className={css.header}
              ref={el => this.headerEl = el}
              onMouseEnter={this.moveStartHandler}
              onMouseLeave={this.moveStopHandler}
            >
             <div className={css.closeBtn} onClick={this.closeHandler}></div>
              {this.title}
            </div>
            <div className={css.body}>
              {this.props.children}
            </div>
          </div>
        </Draggable>
      )
  }
}
