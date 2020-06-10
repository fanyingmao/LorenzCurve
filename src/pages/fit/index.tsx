import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas, Picker } from '@tarojs/components'
import { AtSlider, AtList, AtListItem, AtButton, AtTextarea } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'
import CanvasUtils from '../../utils/CanvasUtils'
import Data from '../../utils/Data'
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
    setFunIndex: Function
  }
}
type StateType = {
  fitX: number
  fitY: number
  fitType: number
  fitStatus: number
  rankIndex: number
  resRank: any[]
  sampleIndex: number
  dataStr: string
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
    this.state = { fitX: 0, fitY: 0, fitType: 0, fitStatus: 0, rankIndex: 0, resRank: [], sampleIndex: 0, dataStr: '' };
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
    const { changeValueStore: { funIndex } } = this.props;
    const { fitStatus, rankIndex, resRank } = this.state;
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    this.mCanvasUtils.drawFitPoint(ctx);
    if (fitStatus === 1) {
      this.mCanvasUtils.drawFunLineA(ctx, funIndex, resRank[rankIndex].resA);
      this.setGini(this.mCanvasUtils.gini);
    }
    // // 开始绘制
    ctx.draw();
  }

  onAddPoint() {
    const { fitX, fitY, fitType } = this.state;
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    if (fitX <= fitY) {
      this.showToast('y值必须小于x值');
    }
    else {
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
      this.setState({ fitX: 0, fitY: 0 });
      ctx.draw();
    }
  }

  onResetPoint() {
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    this.mCanvasUtils.resetFitPoint();
    this.mCanvasUtils.drawFitPoint(ctx);
    ctx.draw();
  }

  onBackPoint() {
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    this.mCanvasUtils.backFitPoint();
    this.mCanvasUtils.drawFitPoint(ctx);
    ctx.draw();
  }

  setFunIndex = (value: string) => {
    const { changeValueStore } = this.props
    changeValueStore.setFunIndex(parseInt(value))
    this.dorwLC();
  }

  selectRankIndex = (index: number) => {
    // this.setState({
    //   rankIndex: index,
    // });
    this.state.rankIndex = index;
    this.setFunIndex(this.mCanvasUtils.resRank[index].funIndex.toString());
  }

  changeFitStatus() {
    const { fitStatus } = this.state;
    if (fitStatus === 0) {
      try {
        this.mCanvasUtils.getFuncFitRank();
      }
      catch (e) {
        this.showToast(e.message);
        return;
      }
      this.state.fitStatus = fitStatus === 0 ? 1 : 0;
      this.state.rankIndex = 0;
      this.state.resRank = this.mCanvasUtils.resRank;
      this.setFunIndex(this.mCanvasUtils.resRank[0].funIndex.toString());
    }
    else {
      this.setState({
        fitStatus: fitStatus === 0 ? 1 : 0,
        rankIndex: 0,
        resRank: []
      })
    }
  }

  onDataSelector = (selectIndex: number) => {
    let dataStr = '';
    dataStr = Data[selectIndex].data.join(',');

    this.setState({
      sampleIndex: selectIndex,
      dataStr
    });
  }

  private showToast = (name: string): void => {
    Taro.showToast({
      icon: 'none',
      title: name
    })
  }

  render() {
    const { changeValueStore: { gini } } = this.props
    const { fitX, fitY, fitStatus, fitType, resRank, rankIndex, sampleIndex, dataStr } = this.state;
    const selector = ['坐标点', '数据集合', '斜率'];
    const selectorData = Data.map(item => item.name);
    return (

      <View className='panel__content'>
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
        {/* 表盘绘制 */}
        <Picker
          mode='selector'
          range={selector}
          value={fitType}
          onChange={(e) => { this.setState({ fitType: Number.parseInt(e.detail.value.toString()) }) }}
        >
          <AtList>
            <AtListItem
              title='拟合数据类型'
              extraText={selector[fitType]}
            />
          </AtList>
        </Picker>
        <Canvas canvasId='fitCanvas' className='canvas' style='width: 100%; height:0;padding-bottom:100%;' />

        <View className='example-item'>
          <View className='example-item' style={{ display: fitStatus === 1 ? 'none' : 'block' }}>
            <View className='example-item' style={{ display: fitType === 0 ? 'block' : 'none' }}>
              <View className='example-item__desc'>x值:{fitX.toFixed(3)}</View>
              <AtSlider value={fitX * this.sliderMax} step={1} max={this.sliderMax} min={0} onChanging={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} onChange={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} ></AtSlider>

              <View className='example-item__desc'>y值:{fitY.toFixed(3)}</View>
              <AtSlider value={fitY * this.sliderMax} step={1} max={this.sliderMax} min={0} onChanging={(value: number) => { this.setState({ fitY: value / this.sliderMax }); }} onChange={(value: number) => { this.setState({ fitY: value / this.sliderMax }); }}></AtSlider>

            </View>
            <View className='example-item' style={{ display: fitType === 1 ? 'block' : 'none' }}>
              <Picker
                mode='selector'
                range={selectorData}
                value={sampleIndex}
                onChange={(e) => {
                  this.onDataSelector(Number.parseInt(e.detail.value.toString()))
                }}
              >
                <AtList>
                  <AtListItem
                    title='样例数据'
                    extraText={selectorData[sampleIndex]}
                  />
                </AtList>
              </Picker>
              <View className='example-item'>
                <AtTextarea
                  count={false}
                  value={dataStr}
                  onChange={(value) => {
                    if ('0123456789.,'.includes(value)) {
                      this.setState({ dataStr: value });
                    }
                    else {
                      this.showToast('输入内容必须是数字或英文逗号');
                    }
                  }}
                  maxLength={200}
                  placeholder='输入数据以逗号分割'
                />
              </View>
            </View>
            <View className='example-item' style={{ display: fitType === 2 ? 'block' : 'none' }}>
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
                <AtButton type='secondary' size='small' onClick={this.onBackPoint.bind(this)}>回退</AtButton>
              </View>
              <View className='subitem'>
                <AtButton type='secondary' size='small' onClick={this.onResetPoint.bind(this)}>重置</AtButton>
              </View>
            </View>
          </View>
          <AtButton type='primary' onClick={this.changeFitStatus.bind(this)}>{fitStatus === 0 ? '显示拟合结果' : '返回数据录入'}</AtButton>
          <View className='example-item' style={{ display: fitStatus === 0 ? 'none' : 'block' }} >
            <View className='example-item__desc'>基尼系数:{gini}</View>
            {
              resRank.map((item, index) => {
                return (
                  <View key={index} onClick={this.selectRankIndex.bind(this, index)}>
                    <View className='example-item__desc'>{index === rankIndex}</View>
                    <View className='example-item__desc'>{item.name}</View>
                    <View className='example-item__desc'>{item.resA}</View>
                    <View className='example-item__desc'>{item.variance}</View>
                  </View>
                )
              })
            }
          </View>
        </View>

      </View>
    )
  }
}

export default Index as ComponentType
