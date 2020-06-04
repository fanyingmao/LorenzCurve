import { CanvasContext, } from "@tarojs/taro";
import { Point } from "./IPoint";
import FunUtils from "./FunUtils";
import FunLC from './FunLC';

export default class CanvasUtils {
    private ctx: CanvasContext;
    private width: number;
    private length: number;
    private gini: number;
    private funLCIndex: number;
    private pointArr: Point[];
    private resA: number;
    private lastX: number;
    private lastY: number;
    private readonly widthRate = 8 / 10;
    private readonly offset = 10;
    private fitPointArr: Point[];
    private yMax: number;//y轴最大值
    constructor(ctx: CanvasContext, width: number) {
        this.ctx = ctx;
        this.width = width;
        this.length = this.width * this.widthRate;
        this.gini = 0;
        this.funLCIndex = 0;
        this.pointArr = [];
        this.fitPointArr = [];
    }

    // 绘制坐标背景
    public drawCoordinate() {
        const length = this.length;
        //设置坐标轴原点
        let painRate = (1 - this.widthRate) / 2;
        this.ctx.translate(this.width * painRate + this.offset, this.width * (1 - painRate) + this.offset);
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.setLineWidth(1);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -length);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(length, 0);

        this.ctx.moveTo(length, -length);
        this.ctx.lineTo(length, 0);

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#0000ff';
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(length, -length);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.setLineDash([4, 4], 2);
        this.ctx.moveTo(length, -length);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        this.ctx.setLineDash([], 0);
        // 原点
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 2, 0, 2 * Math.PI, true);
        this.ctx.fill();
        this.ctx.closePath();

        //绘制原点标题
        this.ctx.font = "15px 微软雅黑"
        this.ctx.scale
        this.ctx.fillText("(0,0)", -16, 16);
        this.ctx.fillText("1", length - 3, 16);
        this.ctx.fillText("1", - 10, -length + 6);
        this.ctx.fillText("(1,1)", length - 16, -length - 8);

    }

    // 绘制函数模型曲线
    public drawFunLine(funLCIndex: number, gini: number) {
        const length = this.length;
        if (this.gini !== gini || this.funLCIndex !== funLCIndex) {
            const { resA, pointArr } = FunUtils.binarySearchAStart(FunLC[funLCIndex].func, gini, FunLC[funLCIndex].minA, FunLC[funLCIndex].maxA);
            this.pointArr = pointArr;
            this.resA = resA;
        }
        this.funLCIndex = funLCIndex;
        this.gini = gini;
        // console.log(pointArr);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.strokeStyle = '#ff0000';
        for (let i = 0; i < this.pointArr.length; i++) {
            this.ctx.lineTo(this.pointArr[i].x * length, -this.pointArr[i].y * length);
        }
        this.ctx.stroke();
    }

    // 绘制x
    public drapXShow(x: number) {
        const length = this.length;
        this.ctx.beginPath();
        this.ctx.setLineDash([4, 4], 2);
        const y = FunLC[this.funLCIndex].func(x, this.resA)
        const k = FunUtils.getDerivative(FunLC[this.funLCIndex].func, this.resA, x);
        this.ctx.moveTo(x * length, 0);
        this.ctx.lineTo(x * length, -y * length);

        this.ctx.strokeStyle = '#666666';


        this.ctx.moveTo(0, -y * length);
        this.ctx.lineTo(x * length, -y * length);
        this.ctx.stroke();
        this.ctx.setLineDash([0, 0], 0);
        if (x > 0.3 && x < 0.97) {
            this.lastX = x;
            this.lastY = y;
        }
        // this.ctx.fillText(`(${x.toFixed(3)},${y.toFixed(3)})\nk=${k.toFixed(3)}`, x * this.length, -y * this.length);
        this.ctx.fillText(`k=${k.toFixed(3)}`, this.lastX * length - 60, -this.lastY * length - 6);
        this.ctx.fillText(x.toFixed(3), this.lastX * length - 20, 16);
        this.ctx.fillText(y.toFixed(3), - 40, -this.lastY * length + 6);

        // const klen =k<1 ? x * this.length/2 : y * this.length/2;
        // this.ctx.beginPath();
        // this.ctx.moveTo(x * this.length - klen, -y * this.length + klen * k);
        // this.ctx.lineTo(x * this.length + klen, -y * this.length - klen * k);
        // this.ctx.strokeStyle = '#00974e';
        // this.ctx.stroke();
    }

    public drawFitPoint() {
        const length = this.length;
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ff0000';

        for (let i = 0; i < this.fitPointArr.length; i++) {
            this.ctx.arc(this.fitPointArr[i].x * length, -this.fitPointArr[i].y * length, 20, 0, 2 * Math.PI, true);
            console.log(this.fitPointArr[i]);
        }

        this.ctx.closePath();
    }

    public addFitPoint(fitPoint: Point) {
        this.fitPointArr.push(fitPoint);
        this.drawFitPoint();
    }

    public clearFitPoint() {
        this.fitPointArr = [];
    }

    public draw() {
        this.ctx.draw();
    }
}