import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'

import counterStore from './store/counter'
import changeValueStore from './store/changeValue'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  counterStore,
  changeValueStore
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  // eslint-disable-next-line react/sort-comp
  config: Config = {
    pages: [
   
      'pages/fit/index',
      'pages/index/index',
      'pages/function/index',
      'pages/help/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '洛伦兹曲线模拟',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/index/index',
          text: '系数',
          iconPath: './images/tab/gini.png',
          selectedIconPath: './images/tab/gini-active.png',
        },      
        {
          pagePath: 'pages/fit/index',
          text: '拟合',
          iconPath: './images/tab/fit.png',
          selectedIconPath: './images/tab/fit-active.png',
        },
        {
          pagePath: 'pages/function/index',
          text: '函数',
          iconPath: './images/tab/fun.png',
          selectedIconPath: './images/tab/fun-active.png',
        },
        {
          pagePath: 'pages/help/index',
          text: '帮助',
          iconPath: './images/tab/help.png',
          selectedIconPath: './images/tab/help-active.png',
        }
      ],
      color: '#333',
      selectedColor: '#006ea6',
      backgroundColor: '#fff',
      borderStyle: 'black',
    }

  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    // const { current } = this.state

    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
