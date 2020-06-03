export enum EPointType {//0:是点 1:是斜率
    Point = 0,
    Slope = 1,
}

export interface Point {
    type?: EPointType
    x: number
    y: number
}