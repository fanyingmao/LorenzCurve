import { observable } from 'mobx'

const changeValue = observable({
  angle: 0,
  proportion: 0,
  gini: 0,
  changeValueStore() {
    this.angle = 0;
    this.proportion = 0;
    this.gini = 0
  },
  setAngle(value: number) {
    this.angle = value;
  },
  setProportion(value: number) {
    this.proportion = value;
  },
  setGini(value: number) {
    this.gini = value;
  },
})
export default changeValue