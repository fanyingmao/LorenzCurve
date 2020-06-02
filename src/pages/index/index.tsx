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
    getDialClock();
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
    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;
    const ctx = Taro.createCanvasContext('myCanvas', this.$scope);
    const length = width * 4 / 5;
    //设置坐标轴原点
    ctx.translate(width / 10, width * 9 / 10);
    ctx.save();

    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(length, -length);
    ctx.moveTo(length, -length);
    ctx.lineTo(length, 0);
    ctx.stroke();
    ctx.closePath();

    // 原点
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();

    //绘制原点标题
    ctx.font = "15px 微软雅黑"
    ctx.scale
    ctx.fillText("(0,0)", -16, 16);
    ctx.fillText("100%", length - 16, 16);
    ctx.fillText("(1,1)", length - 16, -length - 8);

    // // 表盘外圆
    ctx.setLineWidth(2);
    ctx.beginPath();
    ctx.arc(length/2, -length/2, gini, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.stroke();

    // // 表盘刻度（大格）
    // ctx.beginPath();
    // ctx.setLineWidth(5);
    // for(let i = 0; i < 12; i++) {
    //   ctx.beginPath();
    //   ctx.rotate(Math.PI / 6);
    //   ctx.moveTo(R, 0);
    //   ctx.lineTo(r, 0);
    //   ctx.stroke();
    // }
    // ctx.closePath();

    // // 表盘刻度（小格）
    // ctx.beginPath();
    // ctx.setLineWidth(1);
    // for(let i = 0; i < 60; i++) {
    //   ctx.beginPath();
    //   ctx.rotate(Math.PI / 30);
    //   ctx.moveTo(R, 0);
    //   ctx.lineTo(R-10, 0);
    //   ctx.stroke();
    // }
    // ctx.closePath();

    // // 表盘时刻（数字）
    // ctx.beginPath();
    // ctx.setFontSize(16)//设置字体样式
    // // ctx.setTextBaseline("middle");//字体上下居中，绘制时间
    // for(let i = 1; i < 13; i++) {
    //   //利用三角函数计算字体坐标表达式
    //   const x = (r-10) * Math.cos(i * Math.PI / 6 - Math.PI/2);
    //   const y = (r-10) * Math.sin(i * Math.PI / 6 - Math.PI/2);
    //   const sz = i + '';
    //   ctx.fillText(sz, x - 5, y + 5, 15);
    // }
    // ctx.closePath();


    // 开始绘制
    ctx.draw();
  }

  render() {
    const { changeValueStore: { gini, setGini } } = this.props;
    return (
      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        <Text>{gini}</Text>
        {/* 表盘绘制 */}
        <Canvas canvasId='myCanvas' className='canvas' style='width: 20em; height: 20em;' />
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
