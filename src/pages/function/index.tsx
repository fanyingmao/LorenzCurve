import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Canvas } from '@tarojs/components'
import { AtSlider } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'
import FunLC from '../../utils/FunLC';


type PageStateProps = {
  counterStore: {
    counter: number
    increment: Function
    decrement: Function
    incrementAsync: Function
  },
  changeValueStore: {
    angle: number
    proportion: number
    gini: number
    setAngle: Function
    setProportion: Function
    setGini: Function
  }
}

interface Index {
  props: PageStateProps
}

@inject('changeValueStore')
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  // eslint-disable-next-line react/sort-comp
  config: Config = {
    navigationBarTitleText: '模型'
  }

  componentWillMount() { }

  componentWillReact() {
  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  increment = () => {
    const { counterStore } = this.props
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  setGini = (value: number) => {
    const { changeValueStore } = this.props
    changeValueStore.setGini(value)
  }
  getFunName = (func: Function) => {
    const macthArr = func.toString().match(/return.*;/);
    if (macthArr && macthArr.length > 0) {
      return macthArr[0].replace('return ', '').replace(';', '');
    }
    else {
      return null;
    }
  }
  render() {
    return (
      <View className='component-margin-left component-margin-right'>
        <View className='component-list__item' >
          <View className='example-item__desc'>函数名</View>
          <View className='example-item__desc'>函数js表达式</View>
        </View>
        <View>
          {
            FunLC.map((item) => {
              return (
                <View className='component-list__item' key={item.name} >
                  <View className='example-item__desc'>{item.name}</View>
                  <View className='example-item__desc'>{this.getFunName(item.func)}</View>
                </View>
              )
            })
          }
        </View >
      </View >
    )
  }
}

export default Index as ComponentType
