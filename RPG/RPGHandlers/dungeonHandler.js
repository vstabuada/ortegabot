function loadDungeons() {
    const fs = require("fs")
    let dungeonsArray = []
    const dungeonFiles = fs.readdirSync(`./RPG/Dungeons`).filter((file) => file.endsWith('.js'))
    for (const file of dungeonFiles) {
        const dungeonFile = require(`../Dungeons/${file}`)
        dungeonsArray.push(dungeonFile.data)
        continue
    }
    return dungeonsArray
}
module.exports = { loadDungeons }