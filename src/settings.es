export default {
  baseUrl: '',
  restUrl: '',
  imagePath: '',
  indexingEnabled: false,// 标引开关
  labelEnabled:false,// 批注开关
  copyEnabled: false,// 复制开关
  otherLabelEnabled: false,// 他评开关
  bookmarkEnabled: false,// 书签开关
  fontFamily: {
    list: [
      { title: '標楷體', value: '標楷體'},
      { title: '微软雅黑', value: 'Microsoft YaHei' },
      { title: '宋体', value: 'SimSun' },
      { title: '黑体', value: 'SimHei' },
    ],
    index: 0,
  },
  fontSize: {
    list: [
      { title: '小', value: '12px' },
      { title: '中', value: '16px' },
      { title: '大', value: '20px' },
      { title: '特大', value: '24px' },
    ],
    index: 2,
  },
  colorAndBg: {
    list: [
      { title: '默认', value: ['#5C3F21','none','bamboo'] },
      { title: '海天蓝', value: ['#333','#DCE2F0']  },
      { title: '胭脂红', value: ['#333','#FDE6E0']  },
      // { title: '青草绿', value:  ['#333','#E3EDCF']  },
      { title: '米黄色', value: ['#333','beige']  },
    ],
    index: 0,
  },
}
