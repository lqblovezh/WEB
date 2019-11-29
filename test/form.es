import express from 'express'
import createForm from 'simple-form-middleware'

const router = new express.Router()

router.use('/addBookmark', createForm({
  action: '/reader_api/addBookmark',
  fieldset: [
    {
      name: 'bookId',
      value: '7',
    },
    {
      name: 'chapterId',
      value: '1172',
    },
    {
      name: 'selectedText',
      value: 'admin',
    },
    {
      name: 'range',
      value: JSON.stringify({"pathExp":"$.children[0].children[2].children[0]","index":91}).replace(/"/g, '&quot;'),
    },
  ],
  headers: {
    'Content-Type': 'application/json'
  },
  callbackStr: `function(err, text) {
    console.log(err ? err.message : JSON.parse(text))
  }`,
}))

export default router
