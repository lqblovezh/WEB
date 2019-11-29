import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS, reaction} from 'mobx'
import Draggable from 'react-draggable'

import css from './style.css'

@inject('chapterStore', 'bookStore')
@observer
export default class ImageView extends Component {
  constructor(props) {
    super(props)
    reaction(() => props.chapterStore.pageIndex, action(() => {
      this.imgCompareZoom = 1
    }))
  }

  @observable imgCompareZoom = 1

  @action zoomOut () {
    this.imgCompareZoom -= 0.1
  }

  @action zoomIn () {
    this.imgCompareZoom += 0.1
  }

  zoom(evt) {
    const {deltaY, target} = evt
    if (deltaY > 0 && this.imgCompareZoom > 0.7) {
      this.zoomOut()
    } else if (deltaY < 0 && this.imgCompareZoom < 2.3) {
      this.zoomIn()
    }
  }

  render() {
    const {chapterStore} = this.props
    const {content} = chapterStore
    return (<div className={css.wrapper}>
      {
        content && (
          <Draggable key={content.src}>
            <div className={css.draggableBox}>
              <img src={content.src}
                onWheel={evt => this.zoom(evt)}
                onMouseDown={evt => evt.preventDefault()}
                style={{
                  transform: `scale(${this.imgCompareZoom})`
                }}/>
              </div>
            </Draggable>
        )
      }
    </div>)
  }
}
