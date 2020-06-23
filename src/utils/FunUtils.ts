import { Point } from "./IPoint";

export default class FunUtils {
    public static readonly step = 0.001;//微积分的细化度
    public static readonly BinaryAccuracy = 0.000001;//二分查找精度
    public static readonly DerivativeAccuracy = 0.000001;//斜率计算精度
    public static readonly SegmentNum = 512;//函数谷查找拟合分割数
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

    //获得点的斜率
    public static getDerivativeXStart(func: Function, a: number, k: number): number {
        const minK = this.getDerivative(func, a, 0);
        const maxK = this.getDerivative(func, a, 0.999);
        console.log(`对于值超出可计算范围 k:${k} minK:${minK} maxK:${maxK}  `);
        if (k < minK || k > maxK) {
            throw new Error(`对于值超出可计算范围 k:${k} minK:${minK} maxK:${maxK} `);
        }
        return this.getDerivativeX(func, a, k, 0, minK, 0.999, maxK);
    }

    //获得点的斜率
    public static getDerivativeX(func: Function, a: number, k: number, minX: number, minK: number, maxX: number, maxK: number): number {
        const midX = (minX + maxX) / 2;
        const midK = this.getDerivative(func, a, midX);
        if (Math.abs(k - midK) < this.step / 1000) {
            return midX;
        }
        else {
            if (k > midK) {
                return this.getDerivativeX(func, a, k, midX, midK, maxX, maxK);
            }
            else {
                return this.getDerivativeX(func, a, k, minX, minK, midX, midK);
            }
        }
    }

    //获取基尼系数对应a值
    public static binarySearchA(func: Function, integralValue: number, minA: number, miniValue: number, maxA: number, maxValue: number) {
        if (integralValue < miniValue || integralValue > maxValue) {
            throw new Error(`对于值超出设定a值范围`);
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
            let temy = 0;
            if (item.type === 0) {
                temy = Math.pow(func(item.x, a) - item.y, 2);
                // temy = Math.pow(item.y / func(item.x, a) - 1, 2);
            }
            else {
                temy = Math.pow(item.y / this.getDerivative(func, a, item.x) - 1, 2);
            }
            res += temy;
        })
        res = res / pointArr.length;
        return res;
    }

    //函数谷查找拟合
    public static searchPointFit(func: Function, pointArr: Point[], minA: number, miniValue: number, maxA: number) {

        let i: number;
        let mid0Value = 0;
        let midA0 = 0;
        let mid1Value: number = miniValue;
        let midA1: number = minA;
        let mid2Value = mid1Value;
        let midA2 = midA1;
        for (i = 0; i < this.SegmentNum; i++) {
            midA0 = (maxA - minA) / this.SegmentNum * (i + 1) + minA;
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
        if (maxA < minA) {
            const maxValue = this.getPointVariance(func, maxA, pointArr);
            return this.searchPointFit(func, pointArr, maxA, maxValue, minA);
        }
        else {
            const miniValue = this.getPointVariance(func, minA, pointArr);
            return this.searchPointFit(func, pointArr, minA, miniValue, maxA);
        }
    }

    //根据一分一排名算等分均值
    public static getEqualMean(x: number[], y: number[], N: number) {
        const equalMeanArr: number[] = [];
        let temx = 0;
        let temy = 0;
        for (let i = 0; i < x.length; i++) {
            if (temx + x[i] < 1 / N) {
                temx += x[i];
                temy += y[i] * x[i];
            }
            else {
                const upx = 1 / N - temx;
                temx += upx;
                temy += y[i] * upx;
                equalMeanArr.push(temy * N);

                const downx = x[i] / N - upx;
                temx = temy = 0;
                temx += downx;
                temy += y[i] * downx;
            }
        }
        return equalMeanArr;
    }
}