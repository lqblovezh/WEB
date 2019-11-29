import lang from 'lodash/lang'

export function loading (target, property, descriptor) {
  const {initializer} = descriptor
  target[property] = async function(...args) {
    const {
      loadingStore,
    } = this.stores

    const close = await loadingStore.open()
    try {
      return await initializer.call(this).apply(null, args)
    } catch(e) {
      throw e
    } finally {
      close()
    }
  }
  delete descriptor.initializer
  return descriptor
}
