import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction
} from 'mobx'

export default class SettingStore {
  constructor(settings) {
    const {
      fontFamily = {},
      fontSize = {},
      colorAndBg = {}
    } = settings

    this.fontSizeIndex = fontSize.index || 0;
    this.fontSizeList = fontSize.list || [];

    this.fontFamilyIndex = fontFamily.index || 0;
    this.fontFamilyList = fontFamily.list || [];

    this.colorAndBgIndex = colorAndBg.index || 0;
    this.colorAndBgList = colorAndBg.list || [];

    reaction(() => [this.fontSizeIndex, this.fontFamilyIndex], () => {
      this.stores.chapterStore.renderText()
    })
  }

  @observable fontSizeIndex;
  @observable fontFamilyIndex;
  @observable colorAndBgIndex;

  layoutBtns = [
    {
      className: 'layoutLeftBtn',
      textLayout: 'vrl/static'

    },
    {
      className: 'layoutCenterBtn',
      textLayout: 'vrl/auto'
    },
    {
      className: 'layoutRightBtn',
      textLayout: 'lr/auto'
    }];

  @computed get fontSize() {
    return this.fontSizeList[this.fontSizeIndex].value;
  }
  @computed get fontSizeName() {
    return this.fontSizeList[this.fontSizeIndex].title;
  }
  @computed get fontFamily() {
    return this.fontFamilyList[this.fontFamilyIndex].value;
  }
  @computed get fontFamilyName() {
    return this.fontFamilyList[this.fontFamilyIndex].title;
  }
  @computed get colorAndBg() {
    return this.colorAndBgList[this.colorAndBgIndex].value;
  }

  @action changeFontSizeIndex = (index) => {
    if (index < 0) {
      index = 0
    } else if (index >= this.fontSizeList.length) {
      index = this.fontSizeList.length - 1
    }
    this.fontSizeIndex = index;
  }

  @action changeFontFamilyIndex = (index) => {
    if (index < 0) {
      index = 0
    } else if (index >= this.fontFamilyList.length) {
      index = this.fontFamilyList.length - 1
    }
    this.fontFamilyIndex = index;
  }

  @action changeBgColorIndex = (index) => {
    if (index < 0) {
      index = 0
    } else if (index >= this.colorAndBgList.length) {
      index = this.colorAndBgList.length - 1
    }
    this.colorAndBgIndex = index;
  }
}
