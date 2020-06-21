import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas, Picker } from '@tarojs/components'
import { AtSlider, AtList, AtListItem } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'
import CanvasUtils from '../../utils/CanvasUtils'
import FunLC from '../../utils/FunLC'

type PageStateProps = {
  counterStore: {
    counter: number
    increment: Function
    decrement: Function
    incrementAsync: Function
  }
  changeValueStore: {
    funIndex: number
    xShowValue: number
    yShowValue: number
    kShowValue: number
    gini: number
    setFunIndex: Function
    setShowValue: Function
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
  private readonly sliderMax = 1000;
  indexCanvasGg: CanvasUtils;
  indexCanvasX: CanvasUtils;
  componentWillMount() {
    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;
    this.indexCanvasGg = new CanvasUtils(width);
    this.indexCanvasX = new CanvasUtils(width);
    this.dorwLC();
  }

  componentWillReact() {

  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    this.dorwLC();
  }

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

  setFunIndex = (value: string) => {
    const { changeValueStore } = this.props
    changeValueStore.setFunIndex(parseInt(value))
    this.dorwLC();
  }

  setXShowValue = (value: number) => {
    const { changeValueStore } = this.props
    changeValueStore.setShowValue(value)
  }

  private showToast = (name: string): void => {
    Taro.showToast({
      icon: 'none',
      title: name
    })
  }

  // 绘制背景
  dorwLC = () => {
    const { changeValueStore: { gini, xShowValue, funIndex } } = this.props
    const ctx = Taro.createCanvasContext('indexCanvasGg', this.$scope);
    this.indexCanvasGg.initDraw(ctx);
    this.indexCanvasGg.drawCoordinate(ctx);
    try {
      this.indexCanvasGg.drawFunLine(ctx, funIndex, gini);
    } catch (error) {
      this.showToast(error.message);
    }
    // 开始绘制
    ctx.draw();
    this.dorwX();
  }

  // 绘制X
  dorwX = () => {
    const { changeValueStore: { gini, xShowValue, funIndex } } = this.props
    const ctx = Taro.createCanvasContext('indexCanvasX', this.$scope);
    this.indexCanvasGg.initDraw(ctx);
    this.indexCanvasGg.drapXShow(ctx, xShowValue);
    // 开始绘制
    ctx.draw();
  }

  render() {
    const { changeValueStore: { gini, xShowValue, funIndex } } = this.props
    const selector = FunLC.map(item => item.name);
    return (
      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
        <View className='example-item'>
          <Canvas canvasId='indexCanvasGg' className='canvas_bg' style='width: 100%; height:0;padding-bottom:100%;' />
          <Canvas canvasId='indexCanvasX' className='canvas_x' style='width: 100%; height:0;padding-bottom:100%;' />
        </View>
        <View className='component-margin-left component-margin-right'>
          <Picker
            mode='selector'
            range={selector}
            value={funIndex}
            onChange={(e) => { this.setFunIndex(e.detail.value.toString()) }}
          >
            <AtList>
              <AtListItem
                title='模型函数'
                extraText={selector[funIndex]}
              />
            </AtList>
          </Picker>
          <View className='example-item'>
            <View className='example-item__desc component-margin-top'>基尼系数:{gini.toFixed(3)}</View>
            <AtSlider value={gini * this.sliderMax} step={1} max={this.sliderMax} min={0} onChanging={(value: number) => { this.setGini(value / this.sliderMax) }} onChange={() => { this.dorwLC(); }} ></AtSlider>

            <View className='example-item__desc'>x轴数值:{xShowValue.toFixed(3)}</View>
            <AtSlider value={xShowValue * this.sliderMax} step={1} max={this.sliderMax - 1} min={0} onChanging={(value: number) => { this.setXShowValue(value / this.sliderMax); this.dorwX(); }} onChange={() => { this.dorwX(); }} ></AtSlider>
          </View>
        </View>
      </View>

    )
  }
}

export default Index as ComponentType
