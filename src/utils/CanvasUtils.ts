import { CanvasContext, } from "@tarojs/taro";
import { Point } from "./IPoint";
import FunUtils  from "./FunUtils";
import FunLC from './FunLC';

export default class CanvasUtils {
    private ctx: CanvasContext;
    private width: number;
    private length: number;
    private gini: number;
    private funLCIndex: number;
    private pointArr: Point[];
    private resA: number;

    constructor(ctx: CanvasContext, width: number) {
        this.ctx = ctx;
        this.width = width;
        this.length = this.width * 4 / 5;
        this.gini = 0;
        this.funLCIndex = 0;
        this.pointArr = [];
    }

    // 绘制坐标背景
    public drawCoordinate() {
        const length = this.length;
        //设置坐标轴原点
        this.ctx.translate(this.width / 10, this.width * 9 / 10);
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
            const { resA,pointArr } = FunUtils.binarySearchAStart(FunLC[funLCIndex].func, gini, FunLC[funLCIndex].minA, FunLC[funLCIndex].maxA);
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
        this.ctx.moveTo(x*this.length, 0);
        this.ctx.lineTo(x*this.length, -length);
        this.ctx.strokeStyle = '#666666';
        this.ctx.stroke();
    }

    public draw() {
        this.ctx.draw();
    }
}