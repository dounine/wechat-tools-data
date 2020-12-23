

const Mock = (app) => {
    app.get('/wechat/gold/create', function (req, res) {
        res.json({
            code: 'ok',
            data: {
                id: new Date().getTime() + "",
                name: '欢乐斗地主',
                gold: 1000,
                expireGold: 2000
            }
        })
    })
}

module.exports = Mock