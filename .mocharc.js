module.exports = {
  require: 'ts-node/register',
  loader: 'ts-node/esm',
  extensions: ['ts'],
  spec: [
    'test/**/*.test.ts'
  ]
}
