import { CanvasContext, } from "@tarojs/taro";
import { Point } from "./IPoint";
import FunUtils from "./FunUtils";
import FunLC from './FunLC';
//todo: 这里做系数与拟合页面的绘图最好是分开用继承来解耦
export default class CanvasUtils {
    // private ctx: CanvasContext;
    private width: number;
    private length: number;
    public gini: number;
    private funLCIndex: number;
    private pointArr: Point[];
    private resA: number;
    private lastX: number;
    private lastY: number;
    private readonly widthRate = 8 / 10;
    private readonly offset = 10;
    private fitPointArr: Point[];
    private yMax: number;//y轴最大值
    public resRank: { name: string, resA: number, variance: number, funIndex: number }[];
    constructor(width: number) {
        this.width = width;
        this.length = this.width * this.widthRate;
        this.gini = 0;
        this.funLCIndex = 0;
        this.pointArr = [];
        this.fitPointArr = [];
    }
    public initDraw(ctx: CanvasContext) {
        //设置坐标轴原点
        const painRate = (1 - this.widthRate) / 2;
        ctx.translate(this.width * painRate + this.offset, this.width * (1 - painRate) + this.offset);
        ctx.save();
    }

    // 绘制坐标背景
    public drawCoordinate(ctx: CanvasContext) {
        const length = this.length;
        ctx.beginPath();
        ctx.setLineWidth(1);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);

        ctx.moveTo(length, -length);
        ctx.lineTo(length, 0);

        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = '#0000ff';
        ctx.moveTo(0, 0);
        ctx.lineTo(length, -length);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.setLineDash([4, 4], 2);
        ctx.moveTo(length, -length);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.setLineDash([], 0);
        // 原点
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        //绘制原点标题
        ctx.font = "15px 微软雅黑"
        ctx.scale
        ctx.fillText("(0,0)", -16, 16);
        ctx.fillText("1", length - 3, 16);
        ctx.fillText("1", - 10, -length + 6);
        ctx.fillText("(1,1)", length - 16, -length - 8);

    }

    // 绘制函数模型曲线
    public drawFunLine(ctx: CanvasContext, funLCIndex: number, gini: number) {
        const length = this.length;
        // if (this.gini !== gini || this.funLCIndex !== funLCIndex) {
        const { resA, pointArr } = FunUtils.binarySearchAStart(FunLC[funLCIndex].func, gini, FunLC[funLCIndex].minA, FunLC[funLCIndex].maxA);
        this.pointArr = pointArr;
        this.resA = resA;
        // }
        console.log('resA:' + this.resA);
        this.funLCIndex = funLCIndex;
        this.gini = gini;
        // console.log(pointArr);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.strokeStyle = '#ff0000';
        for (let i = 0; i < this.pointArr.length; i++) {
            ctx.lineTo(this.pointArr[i].x * length, -this.pointArr[i].y * length);
        }
        ctx.stroke();
    }

    // 绘制函数模型通过a值绘制
    public drawFunLineA(ctx: CanvasContext, funLCIndex: number, resA: number) {
        const length = this.length;
        // if (this.resA !== resA || this.funLCIndex !== funLCIndex) {
        const { sumy, pointArr } = FunUtils.getIntegral01(FunLC[funLCIndex].func, resA);
        this.pointArr = pointArr;
        this.resA = resA;
        this.gini = 1 - 2 * sumy;
        // }
        this.funLCIndex = funLCIndex;
        // console.log(pointArr);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.strokeStyle = '#ff0000';
        for (let i = 0; i < this.pointArr.length; i++) {
            ctx.lineTo(this.pointArr[i].x * length, -this.pointArr[i].y * length);
        }
        ctx.stroke();
    }

    // 绘制x
    public drapXShow(ctx: CanvasContext, x: number) {
        const length = this.length;
        ctx.beginPath();
        ctx.setLineDash([4, 4], 2);
        const y = FunLC[this.funLCIndex].func(x, this.resA)
        const k = FunUtils.getDerivative(FunLC[this.funLCIndex].func, this.resA, x);
        ctx.moveTo(x * length, 0);
        ctx.lineTo(x * length, -y * length);

        ctx.strokeStyle = '#666666';


        ctx.moveTo(0, -y * length);
        ctx.lineTo(x * length, -y * length);
        ctx.stroke();
        ctx.setLineDash([0, 0], 0);
        if (x > 0.3 && x < 0.97) {
            this.lastX = x;
            this.lastY = y;
        }
        // ctx.fillText(`(${x.toFixed(3)},${y.toFixed(3)})\nk=${k.toFixed(3)}`, x * this.length, -y * this.length);
        ctx.font = "15px 微软雅黑"
        ctx.fillText(`k=${k.toFixed(3)}`, this.lastX * length - 60, -this.lastY * length - 6);
        ctx.fillText(x.toFixed(3), 0.9 * this.lastX * length - 20 - this.lastX, 16);
        ctx.fillText(y.toFixed(3), - 40, -this.lastY * length + 6);

        // const klen =k<1 ? x * this.length/2 : y * this.length/2;
        // ctx.beginPath();
        // ctx.moveTo(x * this.length - klen, -y * this.length + klen * k);
        // ctx.lineTo(x * this.length + klen, -y * this.length - klen * k);
        // ctx.strokeStyle = '#00974e';
        // ctx.stroke();
    }

    public drawFitPoint(ctx: CanvasContext) {
        const length = this.length;


        ctx.fillStyle = '#ff0000';

        for (let i = 0; i < this.fitPointArr.length; i++) {
            ctx.beginPath();
            ctx.arc(Math.floor(this.fitPointArr[i].x * length), Math.floor(-this.fitPointArr[i].y * length), 2, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }

    }
    public resetFitPoint() {
        this.fitPointArr = [];
    }

    public backFitPoint() {
        this.fitPointArr.pop();
    }
    public addFitPoint(fitPoint: Point) {
        this.fitPointArr.push(fitPoint);
    }
    public addDataStr(dataStr: String) {
        this.clearFitPoint();
        let dataArr = dataStr.split(',').map(item => Number.parseInt(item));
        let sum = 0;
        dataArr = dataArr.sort((a, b) => {
            return a > b ? 1 : -1;
        });
        const stepRate = 1 / (2 * dataArr.length);
        dataArr.forEach(item => {
            sum += 2 * item;
        })
        let sumUp = 0;
        let currentRate = 0;
        for (let i = 0; i < dataArr.length; i++) {

            if (i !== 0) {
                const item = dataArr[i - 1];
                sumUp += 2 * item;
                currentRate += 2 * stepRate;
            }
            let x = currentRate + stepRate;
            let y = (sumUp + dataArr[i] / 2) / sum;
            console.log(JSON.stringify({ sumUp, sum, dataArr }));
            console.log(JSON.stringify({ x, y }));
            x = Math.floor(x * 10000) / 10000;
            y = Math.floor(y * 10000) / 10000;
            this.addFitPoint({ type: 0, x, y });
        }
    }
    public clearFitPoint() {
        this.fitPointArr = [];
    }

    // 开始拟合配置中所有函数并安拟合效果排序
    public getFuncFitRank() {
        const pointArr = this.fitPointArr;
        this.resRank = [];
        if (pointArr.length >= 2) {
            this.resRank = FunLC.map((item, index) => {
                let res = FunUtils.searchPointFitStart(item.func, pointArr, item.minA, item.maxA);
                return { name: item.name, resA: res.resA, variance: res.variance, funIndex: index }
            });
            this.resRank.sort((a, b) => {
                if (a.variance > b.variance) {
                    return 1;
                }
                else if (a.variance < b.variance) {
                    return -1;
                }
                else {
                    return 0;
                }
            })
            console.log('resRank:' + JSON.stringify(this.resRank));
        }
        else {
            throw new Error(`最少需要两个数据点`);
        }
    }
}