import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import Draggable from 'react-draggable'
import classnames from 'classnames'

import i18n from '~/i18n'
import css from './style.css'
import FloatBox from '~/components/desktop/FloatBox'

@observer
export default class ComparisonBox extends Component {
  @observable imageIndex = 0
  @observable imageZoom = 1

  @action zoom(e) {
    e.preventDefault();
    var zoom = this.imageZoom;
    if (e.deltaY > 0) {
      zoom -= 0.1;
    } else {
      zoom += 0.1;
    }

    if (zoom < 0.5) {
      zoom = 0.5
    } else if (zoom > 2.5) {
      zoom = 2.5
    }
    this.imageZoom = zoom
    return false;
  }

  @action changeComparisonImgIndex = (index) => {
    this.imageIndex = index
  }

  render() {
    const {
      images,
      onClose,
    } = this.props;
    var currcentImg = images[this.imageIndex]
    return (
      <FloatBox defaultWidth={600} defaultHeight={600}
        title={i18n.COMPARISON_TITLE()} closeHandler={onClose}>

        <div className={css.wrapper}>
          <div className={css.comparisonList}>
            {images.map((item, index) => {
              return <div
                onClick={evt => this.changeComparisonImgIndex(index)}
                className={classnames({
                  [css.comparisonItem]: true,
                  [css.activeComparisonItem]: index === this.imageIndex,
                })} key={index} >{i18n.COMPARISON_TITLE()}-{index + 1}</div>
            })}
          </div>
          <div className={css.comparisonImg}>
          {
            currcentImg && (
              <Draggable>
                <div className={classnames({
                  [css.imgWrap]: true,
                  [css.vertical]: currcentImg.image.vertical,
                })}>
                  <img
                    style={{
                      transform: `scale(${this.imageZoom})`
                    }}
                    onMouseDown={evt => evt.preventDefault()}
                    onClick={evt => evt.preventDefault()}
                    onWheel={evt => this.zoom(evt)}
                    src={currcentImg.image.url} alt="" />
                  </div>
                </Draggable>
            )
          }
          </div>
        </div>

      </FloatBox>)
  }
}
