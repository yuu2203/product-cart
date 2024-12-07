const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_cart'
})

connection.connect()

app.get('/products',(req, res) => {
    let products = []
    connection.query('select * from products', (err, rows, fields) => {
        if(err) throw err
        products = rows
        res.json(products)
    })
})


app.post('/cart',jsonParser, (req, res) => {
    if (!req.body) res.sendStatus(400)
    const { products, total} = req.body
    const query = `insert into cart (products, total) VALUES (?, ?)`
    connection.query(query, [products, total], (err, result) => {
        if (err) throw err
        res.json({ products, total })
    })
})

app.delete('/cart/:id', (req, res) => {
    const {id} = req.params
    const query = 'delete from cart where id = ?'
    connection.query(query, [id], (err, result) => {
        if (err) throw err
        res.json({message: 'deleted'})
    })
})

app.get('/cart/:id', (req, res) => {
    const {id} = req.params
    const query = 'select * from cart where id = ?'
    connection.query(query, [id], (err, result) => {
        if (err) throw err
        res.json({id})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
