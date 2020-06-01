interface IConfigItem {
    name: string,
    func: Function,
    maxA: number,
    minA: number
}
const configList: IConfigItem[] = [
    // 论文 https://pdfs.semanticscholar.org/aef0/c2d36fb11588577f2982aee84e9610b33143.pdf
    {
        name: 'fun1',
        func: function (x: number, a: number) {
            return x - x * Math.pow(1 - x, a);
        },
        maxA: 1,
        minA: 0.01,
    },
    // 论文 https://pdfs.semanticscholar.org/b58f/fd3ba37cd5d4a81a8e7eb6026e0b3a4d24a5.pdf
    {
        name: 'fun2',
        func: function (x: number, a: number) {
            return (Math.exp(a * x) - 1) / (Math.exp(a) - 1);
        },
        maxA: 100,
        minA: 0.01,
    },
    {
        name: 'fun3',
        func: function (x: number, a: number) {
            return (Math.exp(a * x) - 1) / (Math.exp(a) - 1);
        },
        maxA: 100,
        minA: 0.01,
    }
]
export default configList;