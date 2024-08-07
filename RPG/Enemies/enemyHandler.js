const fs = require("fs")

const createEnemy = function (id) {
    fs.open(`C:/Users/spark/OneDrive/Documentos/vscode/Ortega/RPG/Enemies/${id}.json`, "w", function (e) {
        if (e) {
            return console.log(e)
        }
        console.log(`Inimigo criado com sucesso: ${id}.json`)
    })
}

module.exports = { createEnemy }