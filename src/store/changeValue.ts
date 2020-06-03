import { observable } from 'mobx'

const changeValue = observable({
  funIndex: 0,
  xShowValue: 0.5,
  yShowValue: 0.5,
  kShowValue: 0.5,
  gini: 0.5,
  changeValueStore() {
    this.funIndex = 0;
    this.xShowValue = 0;
    this.gini = 0;
  },
  setFunIndex(value: number) {
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
})
export default changeValue