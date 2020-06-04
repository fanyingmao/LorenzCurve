import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas, Picker } from '@tarojs/components'
import { AtSlider, AtList, AtListItem, AtButton } from 'taro-ui'
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
    funIndex: number
    xShowValue: number
    yShowValue: number
    kShowValue: number
    gini: number
    setAngle: Function
    setShowValue: Function
    setGini: Function
  }
}
type StateType = {
  fitX: number
  fitY: number
  fitType: number
  fitStatus: number
}

interface Index {
  props: PageStateProps,
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
  private readonly sliderMax = 100;
  mCanvasUtils: CanvasUtils;

  constructor(props) {
    super(props);
    this.state = { fitX: 0, fitY: 0, fitType: 0, fitStatus: 0 };
  }

  componentWillMount() {
    const res = Taro.getSystemInfoSync()
    const width = res.windowWidth;
    this.mCanvasUtils = new CanvasUtils(width);
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
    changeValueStore.setShowValue(value)
  }

  // 绘制表盘
  dorwLC = () => {
    const { changeValueStore: { gini, xShowValue, funIndex } } = this.props
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    // // 开始绘制
    ctx.draw();
  }

  onAddPoint() {
    const { fitX, fitY, fitType } = this.state;
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    switch (fitType) {
      case 0:
        this.mCanvasUtils.addFitPoint({ type: 0, x: fitX, y: fitY });
        break;
      case 1:
        break;
      case 2:
        break;
    }
    this.mCanvasUtils.drawFitPoint(ctx);
    ctx.draw();
  }

  render() {
    const { changeValueStore } = this.props
    const { fitX, fitY, fitStatus, fitType } = this.state;
    const selector = ['坐标点', '数据集合', '斜率'];
    return (

      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
        <Canvas canvasId='fitCanvas' className='canvas' style='width: 100%; height:0;padding-bottom:100%;' />

        <View className='example-item'>
          <Picker
            mode='selector'
            range={selector}
            value={fitType}
            onChange={(e) => { this.setState({ fitType: e.detail.value }) }}
          >
            <AtList>
              <AtListItem
                title='拟合方式'
                extraText={selector[fitType]}
              />
            </AtList>
          </Picker>
          <View className='example-item'>
            <View className='example-item__desc'>x值:{fitX.toFixed(3)}</View>
            <AtSlider value={fitX * this.sliderMax} step={1} max={this.sliderMax} min={0} onChanging={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} onChange={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} ></AtSlider>

            <View className='example-item__desc'>y值:{fitY.toFixed(3)}</View>
            <AtSlider value={fitY * this.sliderMax} step={1} max={this.sliderMax} min={0} onChanging={(value: number) => { this.setState({ fitY: value / this.sliderMax }); }} onChange={(value: number) => { this.setState({ fitY: value / this.sliderMax }); }}></AtSlider>

          </View>
          <View className='btn-item'>
            <View className='subitem'>
              <AtButton type='primary' size='small' onClick={this.onAddPoint.bind(this)}>添加</AtButton>
            </View>
            <View className='subitem'>
              <AtButton type='secondary' size='small'>重置</AtButton>
            </View>
          </View>

        </View>

      </View>
    )
  }
}

export default Index as ComponentType
