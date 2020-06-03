import { observable } from 'mobx'

const changeValue = observable({
  angle: 0,
  xShowValue: 0.5,
  gini: 0.5,
  changeValueStore() {
    this.angle = 0;
    this.xShowValue = 0;
    this.gini = 0;
  },
  setAngle(value: number) {
    this.angle = value;
  },
  setXShowValue(value: number) {
    this.xShowValue = value;
  },
  setGini(value: number) {
    this.gini = value;
  },
})
export default changeValue