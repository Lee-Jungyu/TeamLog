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
            res.json({ success: false }) // 중복 아이디
            return
        }

        const account = new Account(req.body)
        account.save((err) => {
            if (err) {
                res.json({ success: false }) // 디비 넣는 거 실패 (중복 아이디 가능성도 있음)
                return
            }

            res.json({ success: true })
        })
    })
})

router.post('/sign-in', (req, res) => {
    if (req.session.id != null) {
        res.json({ success: true }) // 이미 로그인 됨
        return
    }

    Account.findOne({ id: req.body.id }).exec((err, account) => {
        if (!account || account.pw !== req.body.pw) {
            res.json({ success: false }) // 정보 확인 요망
            return
        }

        req.session.id = req.body.id
        res.json({ success: true })
    })
})

router.post('/sign-out', (req, res) => {
    req.session.id = null
    res.json({ success: true })
})

router.get('/friends', (req, res) => {
    if (req.session.id == null) {
        res.json({ success: false }) // 로그인 요망
        return
    }

    Friend.find({ from: req.session.id }).select('to').exec((err, fromMe) => {
        Friend.find({ to: req.session.id }).select('from').exec((err, toMe) => {
            fromMe = new Set(fromMe)
            toMe = new Set(toMe)

            const intersect = new Set(fromMe & toMe)

            fromMe = Array.from(fromMe - intersect)
            toMe = Array.from(toMe - intersect)
            const friends = Array.from(intersect)

            res.json({ friends, fromMe, toMe })
        })
    })
})

router.post('/friends', (req, res) => {
    if (req.session.id == null) {
        res.json({ success: false }) // 로그인 요망
        return
    }

    Account.findOne({ id: req.body.id }).exec((err, account) => {
        if (!account) {
            res.json({ success: false }) // 없는 사람
            return
        }

        Friend.findOne({ from: req.session.id, to: req.body.id }).exec((err, account) => { // 에러 확인 요망
            if (account) {
                res.json({ success: false }) // 이미 친구 또는 요청됨
                return
            }

            const friend = new Friend(req.session.id, req.body.id)
            friend.save((err) => {
                if (err) {
                    res.json({ success: false }) // 디비 넣는 거 실패
                    return
                }

                res.json({ success: true })
            })
        })
    })
})

module.exports = router
