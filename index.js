const express = require("express")
const cors = require('cors')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose()

const app = express();

app.use(cors())
app.use(express.json())


app.get("/api", (req, res) => {
    res.json({"message":"success"})
})

app.post('/api/crossword', (req, res) => {

    let raw_glob = Object.values(req.body)

    raw_glob = raw_glob.map((e,i) => {
        if( e == '') return '?'
        return e.toUpperCase()
    })

    const glob_expression = raw_glob.join('')

    const db = new sqlite3.Database(path.resolve(__dirname,'crossword.js'), sqlite3.OPEN_READONLY)

    const stmt = db.all("SELECT * FROM crosswords WHERE word GLOB ?", glob_expression, (err, rows) => {
        if(err) {
            console.error(err.message)
        } else {
            res.json(rows)
        }
    })

    db.close((err) => {
        if(err) {
            console.error(err.message)
        }
    })

})

app.listen(3001, () => {console.log('listening on 3001')})

module.exports = app
