const { readDb } = require("../../Data/dbFunctions")

const RNG = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const getClassIcon = function (x) {
    const { classIcons } = readDb('./Data/rpg.json')
    switch (x) {
        case "warrior":
            return classIcons[0].iconURL
        case "mage":
            return classIcons[1].iconURL
        case "hunter":
            return classIcons[2].iconURL
        case "rogue":
            return classIcons[3].iconURL
        case "cleric":
            return classIcons[4].iconURL
        case "druid":
            return classIcons[5].iconURL
        case "bard":
            return classIcons[6].iconURL
    }
}

const translateStats = function (stats, type) {
    switch (type) {
        case "class":
            switch (stats) {
                case "warrior":
                    return 'Guerreiro'
                case "mage":
                    return 'Mago'
                case "hunter":
                    return 'Caçador'
                case "rogue":
                    return 'Ladino'
                case "cleric":
                    return 'Clérigo'
                case "druid":
                    return 'Druída'
                case "bard":
                    return 'Bardo'
            }
        case "race":
            switch (stats) {
                case "human":
                    return 'Humano'
                case "elf":
                    return 'Elfo'
                case "feral":
                    return 'Feral'
                case "dwarf":
                    return 'Anão'
                case "gnome":
                    return 'Gnomo'
                case "dragonborn":
                    return 'Draconato'
            }
        case "profession":
            switch (stats) {
                case "blacksmith":
                    return 'Ferreiro'
                case "farmer":
                    return 'Fazendeiro'
                case "chef":
                    return 'Cozinheiro'
                case "librarian":
                    return 'Bibliotecário'
                case "alchemist":
                    return 'Alquimista'
                case "tailor":
                    return 'Alfaiate'
                case "priest":
                    return 'Padre'
                case "cartographer":
                    return 'Cartógrafo'
            }
        case "religion":
            switch (stats) {
                case "sabedoria":
                    return 'Deusa da Sabedoria'
                case "guerra":
                    return 'Deusa da Guerra'
                case "colheita":
                    return 'Deusa da Colheita'
                case "comercio":
                    return 'Deusa da Comércio'
            }
    }
}

module.exports = { getClassIcon, translateStats, RNG }