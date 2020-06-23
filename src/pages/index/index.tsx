import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas, Picker, Button } from '@tarojs/components'
import { AtSlider, AtList, AtListItem, AtButton, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
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
    avg: number
    setFunIndex: Function
    setShowValue: Function
    setGini: Function
    setAvg: Function
  }
}
type StateType = {
  k: number
  isOpenedKavg: false
  isOpenedAvg: false
}

interface Index {
  props: PageStateProps
  state: StateType
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

  setAvg = (value: number) => {
    const { changeValueStore } = this.props
    changeValueStore.setAvg(value)
  }

  setKavg = (value: number) => {
    const { changeValueStore: { avg } } = this.props;
    const k = value / avg;
    try {
      const kx = this.indexCanvasGg.getDerivativeX(k);
      // kx = Number.parseFloat(kx.toFixed(3));
      this.setXShowValue(kx);
      this.dorwX();
    } catch (error) {
      this.showToast(error.message);
    }

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
    const { changeValueStore: { gini, funIndex } } = this.props
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
    const { changeValueStore: { xShowValue } } = this.props
    const ctx = Taro.createCanvasContext('indexCanvasX', this.$scope);
    this.indexCanvasGg.initDraw(ctx);
    const k = this.indexCanvasGg.drapXShow(ctx, xShowValue);
    this.setState({ k });
    // 开始绘制
    ctx.draw();
  }

  render() {
    const { changeValueStore: { gini, xShowValue, funIndex, avg } } = this.props
    const { k, isOpenedKavg, isOpenedAvg } = this.state;
    const kavg = k * avg;
    const selector = FunLC.map(item => item.name);
    let avgTem = avg;
    let kavgTem = kavg;
    return (
      <View className='panel__content component-pain-bottom'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
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
        </View>
        <View className='example-item'>
          <Canvas canvasId='indexCanvasGg' className='canvas_bg' style='width: 100%; height:0;padding-bottom:100%;' />
          <Canvas canvasId='indexCanvasX' className='canvas_x' style='width: 100%; height:0;padding-bottom:100%;' />
        </View>
        <View className='component-margin-left component-margin-right'>

          <View className='btn-item component-margin-left component-margin-right'>
            <View className='component-list__item'>
              <View className='example-item__input  component-margin-top'>k*平均值： {kavg.toFixed(1)}</View>
              <View className='subitem'>
                <AtButton type='secondary' size='small' onClick={() => { avgTem = avg; this.setState({ isOpenedKavg: true }) }}>修改</AtButton>
              </View>
            </View>
            <View className='component-list__item'>
              <View className='example-item__input component-margin-top'>平 均 值 ： {avg.toString()}</View>
              <View className='subitem'>
                <AtButton type='secondary' size='small' onClick={() => { avgTem = avg; this.setState({ isOpenedAvg: true }) }}>修改</AtButton>
              </View>
            </View>
          </View>

          <View className='example-item'>
            <View className='example-item__desc component-margin-top'>基尼系数:{gini.toFixed(3)}</View>
            <AtSlider value={Math.round(gini * this.sliderMax)} step={1} max={this.sliderMax} min={0} showValue onChange={(value: number) => { this.setGini(value / this.sliderMax); this.dorwLC(); }} ></AtSlider>

            <View className='example-item__desc'>x轴数值:{xShowValue.toFixed(3)}</View>
            <AtSlider value={xShowValue * this.sliderMax} step={1} max={this.sliderMax - 1} min={0} showValue onChanging={(value: number) => { this.setXShowValue(value / this.sliderMax); this.dorwX(); }} onChange={() => { this.dorwX(); }} ></AtSlider>
          </View>

        </View>
        {/* 基础模态框 */}
        <AtModal
          isOpened={isOpenedKavg}
          onClose={() => {
            this.setState({
              isOpenedKavg: false
            })
          }}
        >
          <AtModalHeader>修改值</AtModalHeader>
          <AtModalContent>
            <View className='modal-content'>
              <AtInput
                name='value4'
                title='k*平均值:'
                type='digit'
                placeholder='k*平均值'
                value={kavgTem.toFixed(1)}
                onChange={(value: string) => { kavgTem = value ? Number.parseFloat(value) : 1 }}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => { this.setState({ isOpenedKavg: false }) }}>取消</Button>
            <Button onClick={() => { this.setKavg(kavgTem); this.setState({ isOpenedKavg: false }) }}>确定</Button>
          </AtModalAction>
        </AtModal>

        {/* 基础模态框 */}
        <AtModal
          isOpened={isOpenedAvg}
          onClose={() => {
            this.setState({
              isOpenedAvg: false
            })
          }}
        >
          <AtModalHeader>修改值</AtModalHeader>
          <AtModalContent>
            <View className='modal-content'>
              <AtInput
                name='value3'
                title='平均值'
                type='digit'
                placeholder='请输入平均值'
                value={avgTem.toString()}
                onChange={(value: string) => { avgTem = value ? Number.parseFloat(value) : 1; }}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => { this.setState({ isOpenedAvg: false }) }}>取消</Button>
            <Button onClick={() => { this.setState({ isOpenedAvg: false }, () => { this.setAvg(avgTem) }) }}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>

    )
  }
}

export default Index as ComponentType
