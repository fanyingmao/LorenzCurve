import { ComponentType } from 'react'
import Taro, { Component, Config, ShareAppMessageReturn } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import { CommonEvent } from '@tarojs/components/types/common';


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
    navigationBarTitleText: '帮助'
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


  private onContact(event: CommonEvent): void {
    console.log('呼起客服回调', event.detail)
  }

  // public onShareAppMessage (): ShareAppMessageReturn {
  //   return {
  //     title: '洛伦兹曲线',
  //     path: '/pages/index/index',
  //   }
  // }
  public onShareAppMessage (): ShareAppMessageReturn {
    return {
      title: '洛伦兹曲线',
      path: '/pages/index/index',
    }
  }
  render() {
    return (
      <View className='panel__content component-pain-bottom'>
        <View className='panel__content component-margin-right'>
        <View className='example-item__desc'>1、简单使用指南
        <View className='example-item__desc'>* 想要估算美国 18 年 收入 10w美元 家庭排在的百分之几的位置？</View>
            <View className='example-item__desc'>1 、到拟合界面选用数据集合拟合。</View>
            <View className='example-item__desc'>2 、样例数据选 18 年美国收入数据，再点添加，这里可以看到数据的的散点分布。</View>
            <View className='example-item__desc'>3 、然后点显示拟合结果，这里可以看到洛伦兹曲线，并得到基尼系数。</View>
            <View className='example-item__desc'>4 、再到系数页面把 k*平均值改成 10w，这时看到到 x 轴数值就是排在的百分比了。</View>
          </View>
          <View className='example-item__desc'>2、程序用途
        <View className='example-item__desc'>一、通过获得的少量数据来拟合出洛伦兹曲线获得基尼系数。</View>
            <View className='example-item__desc'>二、通过洛伦兹曲线和平均值可得到对应数据斜率值和数据在数据集合排在百分之几的位置。</View>
            <View className='example-item__desc'>三、模拟不同基尼系数下的数据集合分布。</View>
          </View>
          <View className='example-item__desc'>3、背景知识，具体可以百科查看
        <View className='example-item__desc'>一、洛伦兹曲线，就是在一个数据集合内，以最小值计算起一直到最大值数据的数据累计值占总累计百分比对应累计数据个数百分比的收百分比的点组成的折线，一般在数据集合足够大且各个相邻数据间的差值足够小时可以看做连续可导的曲线即洛伦兹曲线。x轴是累计数据个数占总数的百分比，y轴是累计数据值的累计值占数据值的总累计值的百分比</View>
            <View className='example-item__desc'>二、基尼系数，绝对平等线与洛伦滋曲线围成的面积占绝对平等线与绝对不平等线围成面积的比值即基尼系数</View>
            <View className='example-item__desc'>三、斜率k，可以发现当洛伦兹曲线斜率为1时增加单位百分比数据时会增加相同单位百分比的累计值即这个斜率值所在的百分位的数据的数据值即平均值。进一步可得x轴上百分比数据的数据值与平均值的比值就是对应洛伦兹曲线的斜率值。</View>
            <View className='example-item__desc'>四、拟合，科学和工程问题可以通过诸如采样、实验等方法获得若干离散的数据，根据这些数据，我们往往希望得到一个连续的函数（也就是曲线）或者更加密集的离散方程与已知数据相吻合，这过程就叫做拟合。</View>
          </View>
          <View className='example-item__desc'>4、程序使用
        <View className='example-item__desc'>*在系数界面可以选择洛伦兹曲线的模型函数然后，可以得到对应基尼系数的洛伦兹曲线，通过拉动x轴可以显示对应位置的斜率k。当k值为1是就是平均值所在的排名百分比，也可以通过数据值与平均值获取对应x轴位置,通过斜率可实现用途二的功能</View>
            <View className='example-item__desc'>*在拟合界面是通过数据来查找合适的拟合函数，有三种拟合方式选择，（三种混用暂不考虑且做拟合至少需要两个数据），同时拟合的结果会与系数界面同步。
          <View className='example-item__desc'>一、坐标点，在数据是类似前百分之几的人累计占有百分之几的的数据使用这种方式拟合。</View>
              <View className='example-item__desc'>二、数据集合，可以是随机取样也可以是像等分均值数据，例如五等分人均可支配收入可以用这种方式拟合，提供了部分数据可选，如成绩，收入，资产数据,理论上各种数据集合都可以往里放。</View>
              <View className='example-item__desc'>三、斜率，使用于类似考试知道平均分班级总数，然后90分以上多少人，80分以上多少人，不及格多少人或者xx分排xx名这样的数据，然后得到对应百分比斜率再用这个方式拟合。</View>
            </View>
            <View className='example-item__desc'>*在函数界面可以看到对应拟合函数的具体公式，为js代码的展示仅支持一个可变参数a的函数。m开头的函数是对应f的以y=-x+1的直线做的镜像函数，例如m0是f0的镜像函数</View>
            <View className='example-item__desc'>*在帮助界面即本页面。</View>
          </View>
          <View className='example-item__desc'>5、关于误差
        <View className='example-item__desc'>一、数据误差，拟合数据本身的误差和数据量不足导致拟合的误差。</View>
            <View className='example-item__desc'>二、模型误差，洛伦兹曲线是统计的结果所以并不能够找到完全没有误差的拟合函数，这里是通过对已有数据选取出拟合效果最好的函数。方差越小拟合效果越好</View>
            <View className='example-item__desc'>三、运算误差，为了不每个函数都对应去求其积分函数和导函数，还有对a值求解都是采用尽量小的微分或二分查找逼近准确值的。考虑到运算量与数值精度所以会存在一定误差。</View>
            <View className='example-item__desc'>鉴于以上误差，结果只能做一个粗略参考。</View>
          </View>
          <View className='example-item__desc'>6、关于反馈
        <View className='example-item__desc'>小程序的bug，建议、有其他的模型函数、数据提供等可通过下面的按钮反馈，可以酌情修改添加。</View>
          </View>
        </View>
        <View className='btn-item component-margin'>
          <AtButton openType='share' onContact={this.onContact.bind(this)} type='primary'>分享应用</AtButton>
        </View>
        <View className='btn-item component-margin'>
          <AtButton openType='contact' onContact={this.onContact.bind(this)} type='secondary'>反馈问题</AtButton>
        </View>

      </View>
    )
  }
}

export default Index as ComponentType
