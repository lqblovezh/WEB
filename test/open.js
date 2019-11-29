const opn = require('opn')
const ip = require('ip')
const simpleGit = require('simple-git')(process.cwd())

simpleGit.branchLocal(function(err, summary){
  const defaultPath = ({
    master: '/reader/index.html',
    mobile: '/reader/h5.html',
  })[summary.current]

  if (defaultPath) {
    openGoogleChrome(`http://${ip.address()}:4430/pc/index.html`)
    openGoogleChrome(`http://${ip.address()}:4430${defaultPath}?bookId=`)
  }
})

function openGoogleChrome(url) {
  const app = ({
    'darwin': 'google chrome',
    'linux': 'google-chrome',
    'win32': 'chrome',
  })[process.platform]

  if (app) {
    opn(url, {
      app: [app, '--incognito'],
      wait: false,
    })
  }
}
