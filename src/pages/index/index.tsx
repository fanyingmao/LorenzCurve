import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import { AtSlider } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'
import CanvasUtils from '../../utils/CanvasUtils'

type PageStateProps = {
  counterStore: {
    counter: number
    increment: Function
    decrement: Function
    incrementAsync: Function
  }
  changeValueStore: {
    angle: number
    xShowValue: number
    gini: number
    setAngle: Function
    setXShowValue: Function
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
    navigationBarTitleText: '系数'
  }
  mCanvasUtils: CanvasUtils;
  componentWillMount() {
    const ctx = Taro.createCanvasContext('myCanvas', this.$scope);
    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;
    this.mCanvasUtils = new CanvasUtils(ctx, width);
    this.dorwLC();
  }

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

  setXShowValue = (value: number) => {
    const { changeValueStore } = this.props
    changeValueStore.setXShowValue(value)
  }

  // 绘制表盘
  dorwLC = () => {
    const { changeValueStore: { gini, xShowValue } } = this.props
 
    this.mCanvasUtils.drawCoordinate();
    try {
      this.mCanvasUtils.drawFunLine(0, gini);
    } catch (error) {
      console.log('绘制模型函数错误:' + error.message);
    }
    this.mCanvasUtils.drapXShow(xShowValue);
    // 开始绘制
    this.mCanvasUtils.draw();
  }



  render() {
    const { changeValueStore: { gini, xShowValue } } = this.props
    return (
      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
        <Canvas canvasId='myCanvas' className='canvas' style='width: 100%; height:0;padding-bottom:100%;' />
        <View className='example-item'>
          <View className='example-item__desc'>基尼系数:{gini.toFixed(3)}</View>
          <AtSlider value={gini * 1000} step={1} max={1000} min={0} onChanging={(value: number) => { this.setGini(value / 1000) }} onChange={() => { this.dorwLC(); }} ></AtSlider>

          <View className='example-item__desc'>x轴数值:{xShowValue.toFixed(3)}</View>
          <AtSlider value={xShowValue * 1000} step={1} max={1000} min={0} onChanging={(value: number) => { this.setXShowValue(value / 1000);this.dorwLC();}} onChange={() => { this.dorwLC(); }} ></AtSlider>
        </View>
      </View>
    )
  }
}

export default Index as ComponentType
