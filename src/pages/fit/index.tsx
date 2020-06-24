import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Canvas, Picker } from '@tarojs/components'
import { AtSlider, AtList, AtListItem, AtButton, AtTextarea, AtIcon, AtInput } from 'taro-ui'
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
    avg: number
    setAngle: Function
    setShowValue: Function
    setGini: Function
    setAvg: Function
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
    navigationBarTitleText: '拟合'
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
  }

  componentWillReact() {

  }

  componentDidMount() {
    this.dorwLC();
  }

  componentDidUpdate() {

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
    value = Number.parseFloat(value.toFixed(3));
    changeValueStore.setAvg(value)
  }

  setXShowValue = (value: number) => {
    const { changeValueStore } = this.props
    changeValueStore.setShowValue(value)
  }

  // 绘制表盘
  dorwLC = () => {
    const { changeValueStore: { funIndex } } = this.props;
    const { fitStatus, rankIndex, resRank, fitType } = this.state;

    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);

    if (fitType === 2) {
      this.mCanvasUtils.drawFitPoint2(ctx);
    }
    else {
      this.mCanvasUtils.drawFitPoint(ctx);
    }
    if (fitStatus === 1) {
      this.mCanvasUtils.drawFunLineA(ctx, funIndex, resRank[rankIndex].resA);
      this.setGini(this.mCanvasUtils.gini);
    }

    // // 开始绘制
    ctx.draw();
  }

  onAddPoint() {
    const { fitX, fitY, fitType, dataStr } = this.state;
    if (fitX <= fitY && fitType === 0) {
      this.showToast('y值必须小于x值');
      return;
    }

    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);

    switch (fitType) {
      case 0:
        this.mCanvasUtils.addFitPoint({ type: 0, x: fitX, y: fitY });
        this.setState({ fitX: 0, fitY: 0 });
        this.mCanvasUtils.drawFitPoint(ctx);
        break;
      case 1:
        if (!/^[0123456789.,]+$/.test(dataStr)) {
          this.showToast('输入内容必须是数字或英文逗号');
          return;
        }
        const avg = this.mCanvasUtils.addDataStr(dataStr);
        this.setAvg(avg);
        this.mCanvasUtils.drawFitPoint(ctx);
        break;
      case 2:
        this.mCanvasUtils.addFitPoint({ type: 1, x: fitX, y: fitY });
        this.setState({ fitX: 0, fitY: 0 });
        this.mCanvasUtils.drawFitPoint2(ctx);
        break;
    }
    this.dorwLC();
    // ctx.draw();
  }

  onResetPoint() {
    this.setState({
      dataStr: '',
      fitStatus: 0
    });
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    this.mCanvasUtils.resetFitPoint();
    ctx.draw();
  }

  onBackPoint() {
    const { fitType } = this.state;
    const ctx = Taro.createCanvasContext('fitCanvas', this.$scope);
    this.mCanvasUtils.initDraw(ctx);
    this.mCanvasUtils.drawCoordinate(ctx);
    this.mCanvasUtils.backFitPoint();
    if (fitType === 2) {
      this.mCanvasUtils.drawFitPoint2(ctx);
    }
    else {
      this.mCanvasUtils.drawFitPoint(ctx);
    }
    ctx.draw();
  }

  setFunIndex = (value: string) => {
    const { changeValueStore } = this.props
    changeValueStore.setFunIndex(parseInt(value))
    this.dorwLC();
  }

  selectRankIndex = (index: number) => {
    this.setState({
      rankIndex: index,
    }, () => {
      this.setFunIndex(this.mCanvasUtils.resRank[index].funIndex.toString());
    });
  }

  changeFitStatus() {
    const { fitStatus } = this.state;
    if (fitStatus === 0) {
      try {
        this.mCanvasUtils.getFuncFitRank();
      }
      catch (e) {
        this.showToast(e.message);
        console.log
        return;
      }
      // this.state.fitStatus = fitStatus === 0 ? 1 : 0;
      // this.state.rankIndex = 0;
      // this.state.resRank = this.mCanvasUtils.resRank;
      this.setState({ fitStatus: fitStatus === 0 ? 1 : 0, rankIndex: 0, resRank: this.mCanvasUtils.resRank }, () => {
        this.setFunIndex(this.mCanvasUtils.resRank[0].funIndex.toString());
      });
    }
    else {
      this.setState({
        fitStatus: fitStatus === 0 ? 1 : 0,
        rankIndex: 0,
        resRank: []
      }, () => {
        this.dorwLC();
      })

    }
  }

  onDataSelector = (selectIndex: number) => {
    let dataStr = '';
    const data = Data[selectIndex].data;
    if (data) {
      dataStr = data.join(',');
    }
    this.onResetPoint();
    this.setState({
      sampleIndex: selectIndex,
      dataStr,
    }, () => {
      this.setAvg(1);
    });
  }

  private showToast = (name: string): void => {
    Taro.showToast({
      icon: 'none',
      title: name
    })
  }

  render() {
    const { changeValueStore: { gini, avg } } = this.props
    const { fitX, fitY, fitStatus, fitType, resRank, rankIndex, sampleIndex, dataStr } = this.state;
    const selector = ['坐标点', '数据集合', '斜率'];
    const selectorData = Data.map(item => item.name);

    return (

      <View className='panel__content component-pain-bottom'>
        <View className='component-margin-left component-margin-right'>
          {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
          {/* 表盘绘制 */}
          <Picker
            mode='selector'
            range={selector}
            value={fitType}
            onChange={(e) => { this.onResetPoint(); this.setState({ fitType: Number.parseInt(e.detail.value.toString()) }) }}
          >
            <AtList>
              <AtListItem
                title='拟合数据类型'
                extraText={selector[fitType]}
              />
            </AtList>
          </Picker>
        </View>

        <Canvas canvasId='fitCanvas' className='canvas' style='width: 100%; height:0;padding-bottom:100%;' />

        <View className='example-item component-margin-left component-margin-right'>
          <View className='example-item' style={{ display: fitStatus === 1 ? 'none' : 'block' }}>
            <View className='example-item' style={{ display: fitType === 0 ? 'block' : 'none' }}>
              <View className='example-item__desc'>x值:{fitX.toFixed(3)}</View>
              <AtSlider value={Math.round(fitX * this.sliderMax)} step={1} max={this.sliderMax} min={0} showValue onChange={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} ></AtSlider>

              <View className='example-item__desc'>y值:{fitY.toFixed(3)}</View>
              <AtSlider value={Math.round(fitY * this.sliderMax)} step={1} max={this.sliderMax} min={0} showValue onChange={(value: number) => { this.setState({ fitY: value / this.sliderMax }); }}></AtSlider>

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
              <View className='example-item__desc component-margin-top'>平均值:{avg.toFixed(3)}</View>
              <View className='example-item'>
                <AtTextarea
                  count={false}
                  value={dataStr}
                  onChange={(value) => {
                    this.setState({ dataStr: value }, () => {
                      this.setAvg(1);
                    });
                  }}
                  maxLength={400}
                  placeholder='输入数据以逗号分割'
                />
              </View>
            </View>
            <View className='example-item' style={{ display: fitType === 2 ? 'block' : 'none' }}>
              <View className='example-item__desc'>x值:{fitX.toFixed(3)}</View>
              <AtSlider value={Math.round(fitX * this.sliderMax)} step={1} max={this.sliderMax - 1} min={0} showValue onChange={(value: number) => { this.setState({ fitX: value / this.sliderMax }); }} ></AtSlider>
              <AtInput
                name='value5'
                title='斜率'
                type='digit'
                placeholder='请输入斜率值'
                value={fitY.toString()}
                onChange={(value: string) => { this.setState({ fitY: value ? Number.parseFloat(value) : 0 }); }}
              />
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
          <View className='component-margin-top component-margin-bottom'>
            <AtButton type='primary' onClick={this.changeFitStatus.bind(this)}>{fitStatus === 0 ? '显示拟合结果' : '返回数据录入'}</AtButton>
          </View>
          <View className='example-item' style={{ display: fitStatus === 0 ? 'none' : 'block' }} >
            <View className='example-item__desc__top'>基尼系数: {gini.toPrecision(3)}</View>
            <View className='component-list__item'>
              <View style={{ visibility: 'hidden' }}>
                <AtIcon value='check' size='20' color='#006ea6'></AtIcon>
              </View>
              <View className='example-item__desc'>函数名</View>
              <View className='example-item__desc'>方差</View>
              <View className='example-item__desc'>a值</View>
            </View>
            {
              resRank.map((item, index) => {
                return (
                  <View className='component-list__item' key={item.name} onClick={this.selectRankIndex.bind(this, index)}>
                    <View style={{ visibility: index === rankIndex ? 'visible' : 'hidden' }}>
                      <AtIcon value='check' size='20' color='#006ea6'></AtIcon>
                    </View>
                    <View className='example-item__desc'>{item.name}</View>
                    <View className='example-item__desc'>{(item.variance * 10000).toPrecision(6)}</View>
                    <View className='example-item__desc'>{item.resA.toPrecision(6)}</View>
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
