import { Point } from "./IPoint";
import FunLC from "./FunLC";

export default class FunUtils {
    public static readonly step = 0.001;//微积分的细化度
    public static readonly BinaryAccuracy = 0.0001;//二分查找精度
    public static readonly DerivativeAccuracy = 0.000001;//斜率计算精度

    //0到1的定积分，和点
    public static getIntegral01(func: Function, a: number) {
        let x = 0;
        let y: number;
        let sumy = 0;
        const pointArr: Point[] = [];
        do {
            x += this.step;
            x = Math.round(x / this.step) * this.step;
            y = func(x, a);
            pointArr.push({ type: 0, x, y });
            sumy += y * this.step;
            // console.log('x' + x + 'y' + y);
        }
        while (x < 1);
        // console.log('res = ' + sumy);
        return { sumy, pointArr };
    }

    //获得点的斜率
    public static getDerivative(func: Function, a: number, x: number): number {
        // if (x < 1) {
        return (func(x + this.DerivativeAccuracy, a) - func(x, a)) / this.DerivativeAccuracy;
        // }
        // else {
        //     return (func(x, a) - func(x - this.DerivativeAccuracy, a)) / this.DerivativeAccuracy;
        // }
    }

    //获取基尼系数对应a值
    public static binarySearchA(func: Function, integralValue: number, minA: number, miniValue: number, maxA: number, maxValue: number) {
        if (integralValue < miniValue || integralValue > maxValue) {
            throw new Error(`最大最小值超出: ${miniValue}  ${maxValue} integralValue:${integralValue}`);
        }
        const midA = (maxA + minA) / 2;
        const { sumy, pointArr } = this.getIntegral01(func, midA);
        // console.log(`${minA} ${midA} ${maxA}`);
        if (Math.abs(sumy - integralValue) < this.BinaryAccuracy) {
            return { resA: midA, pointArr }
        }
        else {
            if (sumy > integralValue) {
                return this.binarySearchA(func, integralValue, minA, miniValue, midA, sumy);
            }
            else {
                return this.binarySearchA(func, integralValue, midA, sumy, maxA, maxValue);
            }
        }
    }

    // 二分查找开始
    public static binarySearchAStart(func: Function, gini: number, minA: number, maxA: number) {
        const maxValue = this.getIntegral01(func, maxA).sumy;
        const miniValue = this.getIntegral01(func, minA).sumy;
        const integralValue = (1 - gini) / 2;
        // console.log(`maxValue ${maxValue}  miniValue ${miniValue}`);
        if (maxValue < miniValue) {
            return this.binarySearchA(func, integralValue, maxA, maxValue, minA, miniValue);
        }
        else {
            return this.binarySearchA(func, integralValue, minA, miniValue, maxA, maxValue);
        }
    }

    //获取函数点与实际点的方差
    public static getPointVariance(func: Function, a: number, pointArr: Point[]) {
        let res = 0;
        pointArr.forEach(item => {
            const temy = Math.pow(func(item.x, a) - item.y, 2);
            res += temy;
        })
        res = res / pointArr.length;
        return res;
    }

    //函数谷查找拟合
    public static searchPointFit(func: Function, pointArr: Point[], minA: number, miniValue: number, maxA: number) {
        const SegmentNum = 4;//分割数

        let i: number;
        let mid0Value = 0;
        let midA0 = 0;
        let mid1Value: number = miniValue;
        let midA1: number = minA;
        let mid2Value = mid1Value;
        let midA2 = midA1;
        for (i = 0; i < SegmentNum; i++) {
            midA0 = (maxA - minA) / SegmentNum * (i + 1) + minA;
            mid0Value = this.getPointVariance(func, midA0, pointArr);
            if (mid0Value > mid1Value) {
                break;
            }
            else {
                midA2 = midA1;
                mid2Value = mid1Value
                midA1 = midA0;
                mid1Value = mid0Value;
            }
        }

        if (Math.abs(midA1 - minA) < this.BinaryAccuracy) {
            return { resA: midA1, variance: mid1Value }
        }
        else {
            return this.searchPointFit(func, pointArr, midA2, mid2Value, midA0);
        }
    }

    // 函数谷查找拟合开始
    public static searchPointFitStart(func: Function, pointArr: Point[], minA: number, maxA: number) {

        // console.log(`maxValue ${maxValue}  miniValue ${miniValue}`);
        if (maxA < minA) {
            const maxValue = this.getPointVariance(func, maxA, pointArr);
            return this.searchPointFit(func, pointArr, maxA, maxValue, minA);
        }
        else {
            const miniValue = this.getPointVariance(func, minA, pointArr);
            return this.searchPointFit(func, pointArr, minA, miniValue, maxA);
        }
    }

}