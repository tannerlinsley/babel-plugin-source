/* global expect */

import path from 'path'
import pluginTester from 'babel-plugin-tester'
import plugin from '../'

const projectRoot = path.join(__dirname, '../../')

expect.addSnapshotSerializer({
  print (val) {
    return val.split(projectRoot).join('<PROJECT_ROOT>/')
  },
  test (val) {
    return typeof val === 'string'
  },
})

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: [
    `
      const MySource = ''
      function ScopedFunction () {
        /* @source MySource */ const foo = 'bar' /* @source MySource */
      }
    `,
    `
      function ScopedFunction () {
        const MySource = ''
        /* @source MySource */ const foo = 'bar' /* @source MySource */
      }
    `,
    `
      const MySource = ''
      /* @source MySource */ const foo = 'bar' /* @source MySource */
    `,
    `
      let MySource
      /* @source MySource */ const foo = 'bar' /* @source MySource */
    `,
    `
      let MySource
      // @source MySource
      const MyComponent = () => (
        console.log('Hello!')
      )
      // @source MySource
    `,
    `
      const MySource = ''
      // @source MySource
      const MyComponent = () => (
        console.log('Hello!')
      )
      // @source MySource
    `,
    `
      let MySource
      let MyOtherSource
      // @source MySource
      const MyComponent = () => (
        console.log('Hello!')
      )
      // @source MySource
      // @source MyOtherSource
      const MyComponent2 = () => (
        console.log('Hello 2!')
      )
      // @source MyOtherSource
    `,
    `
      const MySource = ''
      // @source MySource
      // @source MySource
    `,
    `
      let MySource
      // @source MySource
      // @source MySource
    `,
    `
      let MySource = 'I should be the here'
      /* @source */ const foo = 'bar' /* @source */
    `,
    `
      let MySource = 'I should be the here'
      /* other comment */ const foo = 'bar' /* other comment */
    `,
    `
      /* @source MySource */ const foo = 'bar' /* @source MySource */
    `,
    `
      /* other comment */ const foo = 'bar' /* other comment */
    `,
    `
      let MySources
      let MySource2
      let MySource3
      let MySource4

      /* @source MySources */

      if (true) {
        // do this
      }
      const MyComponent = () => (
        /* @source MySource2 */
        console.log('Hello!')
        /* @source MySource2 */

      )
      const AnotherComponent = () => (
        // @source MySource3
        console.log('Hello Again!')
        // @source MySource3
      )

      /* @source MySource4 */ const aVariable = 'Hello!' /* @source MySource4 */

      /* @source MySources */

      const noSource = 'please!'
    `,
    `
      let MySource
      const MyComponent = () => (
        // @source MySource
        console.log('Hello!')
        // @source MySource
      )
    `,
    `
    const MyComponent = () => (
      // @source MySource
      console.log('Hello!')
      // @source MySource
    )
  `,
  ],
})
