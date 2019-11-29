module.exports = {
  plugins: {
    'autoprefixer': {},
    'precss': {
      'nesting': false,
      'properties': {
        'preserve': 'computed',
      },
      'import': {
        'path': './src',
      },
    },
    'postcss-calc': {},
    'postcss-utilities': {},
    'postcss-url': {
      'url': 'inline',
    },
  }
}
