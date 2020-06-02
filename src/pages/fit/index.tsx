import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Canvas } from '@tarojs/components'
import { AtSlider } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

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
    navigationBarTitleText: '首页'
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



  render() {
    const { changeValueStore: { gini } } = this.props;
    return (
      <View className='panel__content'>
        <View className='example-item'>
          <View className='example-item__desc'>圆心轨倾角</View>
          <AtSlider value={50} step={1} max={90} min={0} showValue></AtSlider>
        </View>
        <View className='example-item'>
          <View className='example-item__desc'>圆最大半径比%</View>
          <AtSlider value={50} step={1} max={100} min={0} showValue></AtSlider>
        </View>
        <View className='example-item'>
          <View className='example-item__desc'>基尼系数%</View>
          <AtSlider value={gini} step={1} max={100} min={0} onChanging={(value: number) => { this.setGini(value) }} ></AtSlider>
        </View>
      </View>
    )
  }
}

export default Index as ComponentType
