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
  isOpenedKavg: boolean
  isOpenedAvg: boolean
  avgTem: string
  kavgTem: string
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

  giniTem: number;
  xTem: number;
  temInterval: NodeJS.Timeout;

  isChangeProcess: boolean;


  constructor(props) {
    super(props);
    this.state = { isOpenedKavg: false, isOpenedAvg: false, k: 0, avgTem: '0', kavgTem: '0' };
  }

  componentWillMount() {
    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;
    this.indexCanvasGg = new CanvasUtils(width);
    this.indexCanvasX = new CanvasUtils(width);
    this.dorwLC();
    this.giniTem = 500;
    this.xTem = 500;
    this.isChangeProcess = false;
    this.temInterval = setInterval(() => {
      if (!this.isChangeProcess) {
        const { changeValueStore: { xShowValue, gini } } = this.props
        this.giniTem = Math.round(gini * this.sliderMax);
        this.xTem = Math.round(xShowValue * this.sliderMax);
        return;
      }
      this.setXshowValue(this.xTem);
      this.setGiniValue(this.giniTem);
    }, 200);

  }

  componentWillReact() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.temInterval);
  }

  componentDidShow() {
    this.dorwLC();
  }
  componentDidHide() {
  }
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
    console.log('setGini   ' + value);
    changeValueStore.setGini(value)
  }

  setAvg = (value: number) => {
    if (!value) {
      value = 1;
    }
    const { changeValueStore } = this.props
    changeValueStore.setAvg(value)
  }

  setKavg = (value: number) => {
    if (!value) {
      value = 1;
    }
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
    console.log('xShowValue   ' + xShowValue);
    const ctx = Taro.createCanvasContext('indexCanvasX', this.$scope);
    this.indexCanvasGg.initDraw(ctx);
    const k = this.indexCanvasGg.drapXShow(ctx, xShowValue);
    this.setState({ k }, () => {
      // 开始绘制
      ctx.draw();
    });
  }

  setXshowValue(value: number) {
    const { changeValueStore: { xShowValue } } = this.props
    if (Math.round(xShowValue * this.sliderMax) !== value) {
      this.setXShowValue(value / this.sliderMax);
      this.dorwX();
      console.log('dorwX' + value + ' ' + xShowValue);
    }
  }

  setGiniValue(value: number) {
    const { changeValueStore: { gini } } = this.props
    if (Math.round(gini * this.sliderMax) !== value) {
      this.setGini(value / this.sliderMax);
      this.dorwLC();
      console.log('dorwLC' + value + ' ' + gini);
    }
  }
  render() {
    const { changeValueStore: { gini, xShowValue, funIndex, avg } } = this.props
    const { k, isOpenedKavg, isOpenedAvg, kavgTem, avgTem } = this.state;
    const kavg = k * avg;
    const selector = FunLC.map(item => item.name);

    return (
      <View className='panel__content component-pain-bottom'>

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
        <View style={{ display: isOpenedAvg || isOpenedKavg ? 'none' : 'block' }} >
          <View className='example-item' >
            <Canvas canvasId='indexCanvasGg' className='canvas_bg' style='width: 100%; height:0;padding-bottom:100%;' />
            <Canvas canvasId='indexCanvasX' className='canvas_x' style='width: 100%; height:0;padding-bottom:100%;' />
          </View>
        </View>

        <View className='component-margin-left component-margin-right'>

          <View className='btn-item component-margin-left component-margin-right'>
            <View className='component-list__item'>
              <View className='example-item__input  component-margin-top'>k*平均值： {kavg.toFixed(3)}</View>
              <View className='subitem'>
                <AtButton type='secondary' size='small' onClick={() => { this.setState({ isOpenedKavg: true, kavgTem: Number.parseFloat(kavg.toFixed(3)) }) }}>修改</AtButton>
              </View>
            </View>
            <View className='component-list__item'>
              <View className='example-item__input component-margin-top'>平 均 值 ： {avg.toString()}</View>
              <View className='subitem'>
                <AtButton type='secondary' size='small' onClick={() => { this.setState({ isOpenedAvg: true, avgTem: avg }) }}>修改</AtButton>
              </View>
            </View>
          </View>

          <View className='example-item'>
            <View className='example-item__desc component-margin-top'>基尼系数:{gini.toFixed(3)}</View>
            <AtSlider value={Math.round(gini * this.sliderMax)} step={1} max={this.sliderMax} min={0} showValue onChanging={(value: number) => { this.isChangeProcess = true; this.giniTem = value }} onChange={(value: number) => { this.isChangeProcess = false; this.setGiniValue(value) }} ></AtSlider>

            <View className='example-item__desc'>x轴数值:{xShowValue.toFixed(3)}</View>
            <AtSlider value={Math.round(xShowValue * this.sliderMax)} step={1} max={this.sliderMax - 1} min={0} showValue onChanging={(value: number) => { this.isChangeProcess = true; this.xTem = value }} onChange={(value: number) => { this.isChangeProcess = false; this.setXshowValue(value) }}></AtSlider>
          </View>

        </View>

        {/* 基础模态框 */}
        <AtModal
          isOpened={isOpenedKavg}
          onClose={() => {

            this.setState({
              isOpenedKavg: false
            }, () => { this.dorwLC(); })
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
                value={kavgTem}
                onChange={(value: string) => { this.setState({ kavgTem: value }) }}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => { this.setState({ isOpenedKavg: false }, () => { this.dorwLC(); }) }}>取消</Button>
            <Button onClick={() => { this.setState({ isOpenedKavg: false }, () => { this.setKavg(Number.parseFloat(kavgTem)); this.dorwLC(); }) }}>确定</Button>
          </AtModalAction>
        </AtModal>

        {/* 基础模态框 */}
        <AtModal
          isOpened={isOpenedAvg}
          onClose={() => {
            this.setState({
              isOpenedAvg: false
            }, () => { this.dorwLC(); })
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
                value={avgTem}
                onChange={(value: string) => { this.setState({ avgTem: value }) }}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => { this.setState({ isOpenedAvg: false }, () => { this.dorwLC(); }) }}>取消</Button>
            <Button onClick={() => { this.setState({ isOpenedAvg: false }, () => { this.setAvg(Number.parseFloat(avgTem)); this.dorwLC(); }) }}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>

    )
  }
}

export default Index as ComponentType
