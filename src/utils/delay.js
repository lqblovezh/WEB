
module.exports = function(timeout){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve()
    }, timeout || 0)
  })
}
