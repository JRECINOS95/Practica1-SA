module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: ['plugin:vue/recommended', '@vue/airbnb'],
    parserOptions: {
      parser: 'babel-eslint',
    },
    rules: {
      "no-unused-vars": "off"
  
    },
  }
  