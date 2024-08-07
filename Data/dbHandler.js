function loadDatabases() {
    const fs = require("fs")
    let databasesArray = []
    const dbFiles = fs.readdirSync(`./Data`).filter((file) => file.endsWith('.json'))
    for (const file of dbFiles) {
        const dbName = () => {
            const rawname = file.slice(0, -5)
            return rawname.charAt(0).toUpperCase() + rawname.slice(1)
        }
        const dbFile = { name: dbName(), path: `./Data/${file}` }
        databasesArray.push(dbFile)
        continue
    }
    return databasesArray
}
module.exports = { loadDatabases }