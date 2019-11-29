import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'

import css from './style.css'
import MastLayer from '~/components/desktop/MastLayer'
import TopBar from "~/components/desktop/TopBar"
import MainBody from '~/components/desktop/MainBody'
import LeftSide from '~/components/desktop/LeftSide'
import LoadingIcon from '~/components/desktop/LoadingIcon'
import ComparisonBox from '~/components/desktop/ComparisonBox'
import LabelFormBox from '~/components/desktop/LabelFormBox'
import TextToolBar from '~/components/desktop/TextToolBar'
import Popover from '~/components/desktop/Popover'
import OthersLabelPanel from '~/components/desktop/OthersLabelPanel'

import {addEvent, removeEvent} from '~/utils/event'

@inject('loadingStore', 'bookStore', 'chapterStore', 'toolStore',
'labelStore', 'textToolStore', 'popoverStore','otherLabelStore')
@observer
export default class Layout extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {
      bookStore,
      params,
    } = this.props

    if (params) {
      bookStore.openBook(params).catch(e => {
        if (__DEV__) {
          console.error(e.stack)
        } else {
          alert(e.toString())
        }
      })
    }

    addEvent(document, 'keydown', this.keyDownHandler)
  }

  componentWillUnmount () {
    removeEvent(document, 'keydown', this.keyDownHandler)
  }
  clickOtherLabelHandler = () => {
    this.props.toolStore.toggle('othersLabel')
  }

  keyDownHandler = (evt) => {
    // Esc
    if (evt.keyCode == 27) {

    }
  }

  render() {
    const {
      loadingStore,
      bookStore,
      chapterStore,
      toolStore,
      labelStore,
      textToolStore,
      popoverStore,
      otherLabelStore,
    } = this.props
    const {
      chapterRid,
      validComparisons,
      settings: {
        otherLabelEnabled,
      }
    } = chapterStore
    return (
      <div className={css.wrapper}>
        <div className={css.container}>
          <MainBody/>
          <LeftSide/>
          <TopBar />
        </div>
        <div className={css.floatBoxes}>
          {
            textToolStore.visible && <TextToolBar />
          }
          {
            toolStore.comparison.visible && (
              <ComparisonBox images={chapterStore.validComparisons}
                onClose={evt => toolStore.toggle('comparison')}
              />
            )
          }
          {
            bookStore.textLayout === 'vrl/static' && chapterStore.spectialComparison && (
              <ComparisonBox images={[chapterStore.spectialComparison]}
                onClose={evt => chapterStore.closeSpectialComparison()}
              />
            )
          }
          {
            labelStore.labelFormVisible &&  <LabelFormBox />
          }
          {
            popoverStore.visible && <Popover />
          }
        </div>
        {
          loadingStore.visible && (
            <MastLayer keepBlur={true}>
              <LoadingIcon />
            </MastLayer>
          )
        }
        {otherLabelEnabled && <div className={css.otherLabelBtn} onClick={this.clickOtherLabelHandler}>
              <div>{otherLabelStore.pages && otherLabelStore.pages.totalCount}</div> <span>个他评</span>
          </div>
        }
        { otherLabelEnabled  &&  <OthersLabelPanel/>}
      </div>
    )
  }
}
