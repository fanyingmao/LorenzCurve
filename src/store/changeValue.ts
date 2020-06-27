import { observable } from 'mobx'

const changeValue = observable({
  funIndex: 1,
  xShowValue: 0.5,
  yShowValue: 0.5,
  kShowValue: 0.5,
  gini: 0.5,
  avg:1,
  changeValueStore() {
    this.funIndex = 1;
    this.xShowValue = 0;
    this.gini = 0;
    this.avg = 1;
  },
  setFunIndex(value: number) {
    console.log('funIndex:'+value);
    this.funIndex = value;
  },
  setShowValue(value: number, yShowValue: number, kShowValue: number) {
    this.xShowValue = value;
    this.yShowValue = yShowValue;
    this.kShowValue = kShowValue;
  },
  setGini(value: number) {
    this.gini = value;
  },
  setAvg(value: number) {
    this.avg = value;
  },
})
export default changeValue