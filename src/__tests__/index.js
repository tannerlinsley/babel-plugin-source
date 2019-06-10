/* global expect */

import path from 'path'
import pluginTester from 'babel-plugin-tester'
import plugin from '../'

const projectRoot = path.join(__dirname, '../../')

expect.addSnapshotSerializer({
  print(val) {
    return val.split(projectRoot).join('<PROJECT_ROOT>/')
  },
  test(val) {
    return typeof val === 'string'
  }
})

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: {
    presets: ['@babel/preset-react']
  },
  tests: [
    `
      let MySource
      function ScopedFunction () {
        /* @source MySource */ const foo = 'bar' /* @source MySource */
      }
    `,
    `
      function ScopedFunction () {
        let MySource
        /* @source MySource */ const foo = 'bar' /* @source MySource */
      }
    `,
    `
      let MySource
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
      let MySource
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
      let MySource
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
      const MySource = ''
  
      const MyComponent = () => (
        // @source MySource
        console.log('Hello!')
        // @source MySource
      )
    `,
    `
      let MyJSXSource
      const MyComponent = () => (
        // @source MyJSXSource
        <div>Hello!</div>
        // @source MyJSXSource
      )
    `,
    `
      let sourceCode

      console.log(sourceCode)

      export default () => (
        <Sidebar>
          <ChartConfig dataType="time">
            {({ data }) => (
              // @source sourceCode
              <Chart data={data}>
                <Axis primary type="time" position="bottom" />
                <Axis type="linear" position="left" stacked />
                <Series type={Area} />
                <Tooltip />
              </Chart>
              // @source sourceCode
            )}
          </ChartConfig>
          <Code source={sourceCode} />
        </Sidebar>
      )
    `,
    `import React from 'react'

      //
      
      import Sidebar from 'components/Sidebar'
      import ChartConfig from 'components/ChartConfig'
      import Code from 'components/Code'
      
      import { Chart, Axis, Series, Tooltip, Area } from '../../../src'
      
      const sourceCode = ''
      
      export default () => (
        <Sidebar>
          <ChartConfig dataType="time">
            {({ data }) => (
              // @source sourceCode
              <Chart data={data}>
                <Axis primary type="time" position="bottom" />
                <Axis type="linear" position="left" stacked />
                <Series type={Area} />
                <Tooltip />
              </Chart>
              // @source sourceCode
            )}
          </ChartConfig>
          <Code source={sourceCode} />
        </Sidebar>
      )
    `,
    {
      error: true,
      snapshot: false,
      code: `
        const MyComponent = () => (
          // @source MySource
          console.log('Hello!')
          // @source MySource
        )    
    `
    },
    `import React from 'react'

    //
    
    import useChartConfig from 'hooks/useChartConfig'
    import Box from 'components/Box'
    import { Chart } from '../../../dist'
    
    let sourceCode
    
    // @source sourceCode

    export default () => {
      const { data, randomizeData } = useChartConfig({
        series: 10
      })
      const series = React.useMemo(
        () => ({
          type: 'area'
        }),
        []
      )
      const axes = React.useMemo(
        () => [
          { primary: true, position: 'bottom', type: 'time' },
          { position: 'left', type: 'linear', stacked: true }
        ],
        []
      )
      return (
        <>
          <button onClick={randomizeData}>Randomize Data</button>
          <br />
          <br />
          <Box>
            <Chart data={data} series={series} axes={axes} tooltip />
          </Box>
          <br />
          <pre>
            <code>{sourceCode}</code>
          </pre>
        </>
      )
    }
    // @source sourceCode
    `
  ]
})
