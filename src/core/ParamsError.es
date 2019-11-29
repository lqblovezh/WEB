export default class ParamsError extends Error {
  constructor (funcName, ...args) {
    super(`${funcName}(${args.map(v => JSON.stringify(v, null, '  ')).join(', ')})`)
  }
}
