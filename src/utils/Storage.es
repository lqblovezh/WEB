import lang from 'lodash/lang'

export class Storage {
  constructor(storage, key) {
    this.storage = storage
    this.key = key
  }

  setValue (value) {
    if (this.storage && this.key) {
      this.storage.setItem(this.key, JSON.stringify(value))
      return true
    }
    return false
  }

  getValue () {
    if (this.storage && this.key) {
      const value = this.storage.getItem(this.key)
      if (value) {
        return JSON.parse(value)
      }
    }
    return null
  }

  removeValue () {
    if (this.storage && this.key) {
      this.storage.removeItem(this.key)
      return true
    }
    return false
  }
}

export class ListStorage extends Storage {
  constructor (storage, key, maxLength = Infinity) {
    super(storage, key)
    this.maxLength = maxLength
    const list = this.getValue() || []
    const length = list.length - this.maxLength
    for (let i=0; i<length; i++) {
      list.shift()
    }
    this.list = list
  }

  addItem (item) {
    const length = this.list.push(item) - this.maxLength
    for (let i=0; i<length; i++) {
      this.list.shift()
    }
    return this.setValue(this.list)
  }

  removeItem (item, customizer) {
    this.list = this.list.filter(_item => !lang.isEqualWith(_item, item, customizer))
    return this.setValue(this.list)
  }

  removeAll () {
    this.list = []
    return this.removeValue()
  }
}

export default Storage
