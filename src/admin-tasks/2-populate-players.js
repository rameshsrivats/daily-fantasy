// const excelToJson = require('convert-excel-to-json')
// const Team = require('./models/team')
// const Player = require('./models/player')

// // Create an excel sheet with no headers
// // This converts it an object (return) with attribute (filename) which is an array of objects for each row 
// const parseExcel = async () => {
//     const xlObject = await excelToJson({
//         sourceFile: '/Users/ramesh/Documents/Fantasy/players.xlsx',
//         columnToKey: {
//             A: 'name',
//             B: 'longName',
//             C: 'teamName',
//             D: 'skill',
//             E: 'price',
//             F: 'overseas'
//         }
//     })
//     return xlObject.Sheet1
// }

// // Process the above array so that overseas is made boolean, and team._id is pulled
// const processArray = async (rawArray) => {
//     processedArray = []
//     const teams = await Team.find()
//     rawArray.forEach((player) => {
//         const playerObject = {}
//         playerObject.name = player.name
//         playerObject.longName = player.longName
//         playerObject.skill = player.skill
//         playerObject.price = player.price
//         if (player.overseas === 'TRUE') {
//             playerObject.overseas = true
//         } else {
//             playerObject.overseas = false
//         }
//         for (i=0; i<teams.length; i++) {
//             if (teams[i].name === player.teamName) {
//                 playerObject.team = teams[i]._id
//             }
//         }
//         processedArray.push(playerObject)
//     })
//     return processedArray
// }

// const uploadPlayer = async (playerObj) => {
//     const player = new Player(playerObj)
//     try {
//         await player.save()
//     } catch {
//         console.log('Upload error')
//     }
    
    
// }

// parseExcel().then((rawArray) => {
//     processArray(rawArray).then((finalArray) => {
//         finalArray.forEach((player) => {
//             uploadPlayer(player)
//         })
//     })
// }).catch((e) => {
//     console.log('Some error')
// })  