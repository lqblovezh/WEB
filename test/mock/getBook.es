let idCount = 0

export default function(req) {
  return {
    status: true,
    error: '',
    book_name: '样例数据',
    book_category: 'guji',
    text_layout: 'lr/auto',
    // text_layout: 'vrl/static',
    reader_type: 1,
    menu: [
      {
        chapter_id: 'guji.xml',
        chapter_name: '馬王堆漢墓帛書《易經》 (xml:id="para67")',
        xml_id: 'para60',
        menu: []
      }, {
        chapter_id: 'heading.xml',
        chapter_name: '多级大纲',
        menu: []
      }, {
        chapter_id: 'comment.xml',
        chapter_name: '多行小字',
        xml_id: 'para4',
        menu: []
      }, {
        chapter_id: 'cover.xml',
        chapter_name: '封面',
        menu: []
      }
    ],
    note: [
      {
        id: idCount++,
        bookId: '',
        chapterId: 'guji.xml',
        range: JSON.stringify({
          "start": {
            "pathExp": "$.children[0].children[1].children[6]",
            "index": 31
          },
          "end": {
            "pathExp": "$.children[0].children[2].children[4]",
            "offset": 29
          }
        }),
        selectedText: '在天，利見大人。尚九：抗龍有悔。迵九：見群龍无首，吉。 一行[婦]：婦之非人，不利，君子貞，大往小來。初六，犮茅茹，以其囗，貞吉，亨。六二，枹承，小人吉，大人不亨。六三，枹憂。九四，有命，无咎，',
        userText: '跨标签的内容',
        create_time: '1513652599',
      }, {
        id: idCount++,
        bookId: '',
        chapterId: 'guji.xml',
        range: JSON.stringify({
          "start": {
            "pathExp": "$.children[0].children[5].children[2]",
            "index": 17
          },
          "end": {
            "pathExp": "$.children[0].children[5].children[2]",
            "index": 17,
            "offset": 2
          }
        }),
        selectedText: '用見',
        userText: '在标签中的内容',
        create_time: '1513652599',
      }, {
        id: idCount++,
        bookId: '',
        chapterId: 'comment.xml',
        range: JSON.stringify({
          "start": {
            "pathExp": "$.children[0].children[2].children[1].children[27].children[0]",
            "index": 16
          },
          "end": {
            "pathExp": "$.children[0].children[2].children[1].children[27].children[2]",
            "index": 0,
            "offset": 2
          }
        }),
        selectedText: '故稱\n莊子',
        userText: '跨注释的内容',
        create_time: '1513652599',
      }
    ]
  }
}
