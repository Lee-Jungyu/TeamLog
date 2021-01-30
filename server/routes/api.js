const Account = require('../models/account')
const Friend = require('../models/friend')

const express = require('express')
const router = express.Router()

router.get('/version', (req, res) => {
    res.json({ version: 0.1 })
})

router.post('/sign-up', (req, res) => {
    Account.find({ id: req.body.id }).exec((err, accounts) => {
        if (accounts.length) {
            console.log('가입: 중복')
            res.json({ success: false }) // 중복 아이디
            return
        }

        const account = new Account(req.body)
        account.save((err) => {
            if (err) {
                console.log('가입: 디비문제발생')
                res.json({ success: false }) // 디비 넣는 거 실패 (중복 아이디 가능성도 있음)
                return
            }

            console.log('가입: 완료')
            res.json({ success: true })
        })
    })
})

router.post('/sign-in', (req, res) => {
    if (req.session.userId != null) {
        console.log('로긴: 이미 함')
        res.json({ success: false }) // 이미 로그인 됨
        return
    }

    Account.findOne({ id: req.body.id }).exec((err, account) => {
        if (!account || account.pw !== req.body.pw) {
            console.log('로긴: 정보 틀림')
            res.json({ success: false }) // 정보 확인 요망
            return
        }

        console.log('로긴: 성공')
        req.session.userId = req.body.id
        res.json({ success: true })
    })
})

router.post('/sign-out', (req, res) => {
    console.log('로그아웃: 완료')
    req.session.userId = null
    res.json({ success: true })
})

router.get('/friends', (req, res) => {
    if (req.session.userId == null) {
        console.log('친구조회: 로긴 요망')
        res.json({ success: false }) // 로그인 요망
        return
    }

    Friend.find({ from: req.session.userId }).select('to').exec((err, fromMe) => {
        Friend.find({ to: req.session.userId }).select('from').exec((err, toMe) => {

            fromMe = new Set(fromMe.map(x => x.to))
            toMe = new Set(toMe.map(x => x.from))

            const intersect = new Set([...fromMe].filter(x => toMe.has(x)))

            fromMe = Array.from(new Set([...fromMe].filter(x => !intersect.has(x))))
            toMe = Array.from(new Set([...toMe].filter(x => !intersect.has(x))))
            const friends = Array.from(intersect)


            console.log('친구조회: 완료')
            res.json({ friends, fromMe, toMe })
        })
    })
})

router.post('/friends', (req, res) => {
    if (req.session.userId == null) {
        console.log('친구생성: 로긴 요망')
        res.json({ success: false }) // 로그인 요망
        return
    }

    Account.findOne({ id: req.body.id }).exec((err, account) => {
        if (!account) {
            console.log('친구생성: 없는 사람')
            res.json({ success: false }) // 없는 사람
            return
        }

        Friend.findOne({ from: req.session.userId, to: req.body.id }).exec((err, account) => { // 에러 확인 요망
            if (account) {
                console.log('친구생성: 중복')
                res.json({ success: false }) // 이미 친구 또는 요청됨
                return
            }

            const friend = new Friend({ from: req.session.userId, to: req.body.id })
            friend.save((err) => {
                if (err) {
                    console.log('친구생성: 디비실패')
                    res.json({ success: false }) // 디비 넣는 거 실패
                    return
                }

                console.log('친구생성: 성공')
                res.json({ success: true })
            })
        })
    })
})

module.exports = router
