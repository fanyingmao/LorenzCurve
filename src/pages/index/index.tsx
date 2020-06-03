import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Canvas } from '@tarojs/components'
import { AtSlider } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'
import { CanvasUtils } from '../../utils/CanvasUtils'
import { FunUtils } from '../../utils/FunUtils'
import FunLC from '../../utils/FunLC'

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
    navigationBarTitleText: '系数'
  }

  componentWillMount() {
    this.getDialClock();
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


  // 绘制表盘
  getDialClock = () => {
    const { changeValueStore: { gini } } = this.props

    const ctx = Taro.createCanvasContext('myCanvas', this.$scope);

    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;

    const mCanvasUtils = new CanvasUtils(ctx, width);
    mCanvasUtils.drawCoordinate();
    try {
      let res = FunUtils.binarySearchAStart(FunLC[0].func, gini, FunLC[0].minA, FunLC[0].maxA);
      mCanvasUtils.drawFunLine(res.pointArr);
    } catch (error) {
      console.log('绘制模型函数错误:' + error.message);
    }

    // 开始绘制
    ctx.draw();
  }

  render() {
    const { changeValueStore: { gini } } = this.props
    return (
      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
        <Canvas canvasId='myCanvas' className='canvas' style='width: 100%; height:0;padding-bottom:100%;' />
        <View className='example-item'>
          <View className='example-item__desc'>基尼系数{gini}</View>
          <AtSlider value={gini*100} step={1} max={100} min={0} onChanging={(value: number) => { this.setGini(value/100) }} onChange={() => { this.getDialClock(); }} ></AtSlider>
        </View>
      </View>
    )
  }
}

export default Index as ComponentType
