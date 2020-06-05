interface ConfigItem {
    name: string
    func: Function
    maxA: number
    minA: number
    from: string
}
const configList: ConfigItem[] = [
    // 论文 https://pdfs.semanticscholar.org/b58f/fd3ba37cd5d4a81a8e7eb6026e0b3a4d24a5.pdf
    {
        name: 'f0',
        func: function (x: number, a: number) {
            return 1 - Math.log((1-x) * (Math.exp(a) - 1) + 1)/a;
        },
        maxA: 100,
        minA: 0.01,
        from: '模型来自于国外一个教授论文'
    },
    // 论文 https://pdfs.semanticscholar.org/aef0/c2d36fb11588577f2982aee84e9610b33143.pdf
    {
        name: 'f1',
        func: function (x: number, a: number) {
            return x - x * Math.pow(1 - x, a);
        },
        maxA: 4,
        minA: 0.01,
        from: '模型来自于中科大论文'
    },    
    {
        name: 'f2',
        func: function (x: number, a: number) {
            return 1 - Math.pow(1 - x, a);
        },
        maxA: 1,
        minA: 0.01,
        from: '模型来自于中科大论文'
    },
]
export default configList;