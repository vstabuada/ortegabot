const fs = require('fs')

function writeFile(obj, fileName, fileExtension) {
    if (!obj) return console.log('Please provide data to save')
    try {
        const filePath = `./Files/${fileName}.${fileExtension}`
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
        return { name: fileName, extension: fileExtension, path: filePath }
    } catch (err) {
        return console.log('FAILED TO WRITE')
    }
}
module.exports = { writeFile }