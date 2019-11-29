import {observable, computed, action, runInAction, toJS} from 'mobx'
import ReactDOM from 'react-dom'

export default class ToolStore {

  @observable catalog = {
    visible: false,
  }

  @observable setting = {
    visible: false,
  }

  @observable label = {
    visible : false,
  }

  @observable search = {
    visible : false,
  }

  @observable comparison = {
    visible: false,
  }

  @observable othersLabel = {
    visible: false,
  }

  @observable bookmark = {
    visible: false,
  }

  @observable toolBar = {
    visible: false,
    fontFamily: {
      visible: false,
    },
    bottomBar: {
      visible: false,
    },
    setting: {
      visible: false,
    }
  }



  @action toggle = (name) => {
    for(let key in this) {
      let item = this[key]
      if (name === key) {
        item.visible = !item.visible
      } else {
        item.visible = false
      }
      if (key === 'toolBar') {
        this.showToolBar('bottomBar')
      }
    }
  }

  @action showToolBar = (name) => {
    for(let key in this.toolBar) {
      if(typeof this.toolBar[key] === 'object'){
        let item = this.toolBar[key]
        item.visible = name === key
      }
    }
  }

  goBack = async() => {
    await this.services.go_back({}, this.settings);
  }
}
