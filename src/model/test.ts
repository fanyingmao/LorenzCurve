//单元测试
import { FunUtils } from './FunUtils';
import FunLC from './FunLC';
let startTime = Date.now();
// let res = FunUtils.binarySearchAStart(FunLC[0].func, 0.5, FunLC[0].minA, FunLC[0].maxA);
// let res = FunUtils.getIntegral0_1(FunLC[0].func, 0.5);

let res = FunUtils.searchPointFitStart(FunLC[0].func, [{ x: 0.8, y: 0.2 }], FunLC[0].minA, FunLC[0].maxA);
console.log(res);
let spenTime = (Date.now() - startTime) / 1000;
console.log('spenTime:' + spenTime);