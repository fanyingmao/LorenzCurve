import { Point } from "./IPoint";

export default class FunUtils {
    public static readonly step = 0.001;//微积分的细化度
    public static readonly BinaryAccuracy = 0.001;//二分查找精度
    public static readonly DerivativeAccuracy = 0.0001;//斜率计算精度

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
            pointArr.push({type:0,x,y});
            sumy += y * this.step;
            // console.log('x' + x + 'y' + y);
        }
        while (x < 1);
        // console.log('res = ' + sumy);
        return { sumy, pointArr };
    }

    //获得点的斜率
    public static getDerivative(func: Function, a: number, x: number): number {
        return (func(x + this.DerivativeAccuracy / 10, a) - func(x, a)) / this.DerivativeAccuracy;
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

    //获取函数点与实际点的标准差
    public static getPointVariance(func: Function, a: number, pointArr: Point[]) {
        let res = 0;
        pointArr.forEach(item => {
            const temy = Math.pow(func(item.x, a) - item.y, 2);
            res += temy;
        })
        res = res / pointArr.length;
        return res;
    }

    //三段函数谷查找拟合
    public static searchPointFit(func: Function, pointArr: Point[], minA: number, miniValue: number, maxA: number, maxValue: number) {

        const midAL = (maxA - minA) / 3 * 1 + minA;
        const midAH = (maxA - minA) / 3 * 2 + minA;

        const midLValue = this.getPointVariance(func, midAL, pointArr);
        const midHValue = this.getPointVariance(func, midAH, pointArr);
        const resValue = midLValue < midHValue ? midLValue : midHValue;

        if (Math.abs(resValue - (miniValue + maxValue) / 2) < this.BinaryAccuracy) {
            return { resA: midLValue < midHValue ? midAL : midAH }
        }
        else {
            const value1 = (miniValue + midLValue) / 2;
            const value2 = (midLValue + midHValue) / 2;
            const value3 = (midHValue + maxValue) / 2;
            if (value1 <= value2 && value1 <= value3) {
                return this.searchPointFit(func, pointArr, minA, miniValue, midAL, midLValue);
            }
            else if (value2 <= value1 && value2 <= value2) {
                return this.searchPointFit(func, pointArr, midAL, midLValue, midAH, midHValue);
            }
            else if (value3 <= value1 && value3 <= value2) {
                return this.searchPointFit(func, pointArr, midAH, midHValue, maxA, maxValue);
            }
        }
    }

    // 三段函数谷查找拟合开始
    public static searchPointFitStart(func: Function, pointArr: Point[], minA: number, maxA: number) {
        const maxValue = this.getPointVariance(func, maxA, pointArr);
        const miniValue = this.getPointVariance(func, minA, pointArr);
        // console.log(`maxValue ${maxValue}  miniValue ${miniValue}`);
        if (maxA < minA) {
            return this.searchPointFit(func, pointArr, maxA, maxValue, minA, miniValue);
        }
        else {
            return this.searchPointFit(func, pointArr, minA, miniValue, maxA, maxValue);
        }
    }
}