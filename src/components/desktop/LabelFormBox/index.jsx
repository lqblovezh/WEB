import React, { Component } from 'react'
import { observer, inject, Observer } from 'mobx-react'
import { observable, action, toJS, runInAction } from 'mobx'
import classnames from 'classnames'

import css from './style.css'
import FloatBox from '~/components/desktop/FloatBox'
import MastLayer from '~/components/desktop/MastLayer'
import i18n from '~/i18n'


@inject('labelStore')
@observer
export default class LabelFormBox extends Component {

  userText = null;
  isOpenLabel = 0;

  submitHandler = (evt) => {
    const { labelStore } = this.props;
    if (this.userText) {
      labelStore.addLabel({userText:this.userText ,isOpenLabel:this.isOpenLabel }).catch(e => alert(e.toString()))
    }
  }

  changeHandler = (evt) => {
    this.userText = evt.target.value
  }

  radioClickHandler = (evt) => {
    if(evt.target.checked){
      this.isOpenLabel = 1;
    }else {
      this.isOpenLabel = 0;
    }
  }

  closeHandler = () => {
    const { labelStore } = this.props;
    labelStore.hideFormBox();
  }

  render() {
    return (
      <div className={css.wrapper}>
        <FloatBox align={'center'} defaultWidth={550} defaultHeight={300}
           title={i18n.LABEL_ADD()} closeHandler={this.closeHandler}  >
          <div className={css.content}>
            <div className={css.labelInput} >
              <textarea onChange={this.changeHandler}></textarea>
            </div>
            <div onClick={this.submitHandler} className={css.comfirmBtn}>{i18n.SAVE()}</div>
            <div className={css.open}>
              <input type="checkbox" name="protected"  onClick = {this.radioClickHandler} value="1"/>公开
            </div>
          </div>
        </FloatBox>
      </div>
    )
  }

}
