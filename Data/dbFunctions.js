const fs = require('fs')

function readDb(dbName = './Data/database.json') {
    try {
        const data = fs.readFileSync(dbName, 'utf8')
        return JSON.parse(data)
    } catch (e) {
        return undefined
    }
}

function writeDb(obj, dbName = './Data/database.json') {
    if (!obj) return console.log('Please provide data to save')
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj))
        return obj
    } catch (err) {
        return console.log('FAILED TO WRITE')
    }
}
module.exports = { readDb, writeDb }