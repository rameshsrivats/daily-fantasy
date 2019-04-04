// const excelToJson = require('convert-excel-to-json')
// const Team = require('./models/team')
// const Player = require('./models/player')
// const Fixture = require('./models/fixture')

// // Create an excel sheet with no headers
// // This converts it an object (return) with attribute (filename) which is an array of objects for each row 
// const parseExcel = async () => {
//     const xlObject = await excelToJson({
//         sourceFile: '/Users/ramesh/Documents/Fantasy/fixtures.xlsx',
//         columnToKey: {
//             A: 'matchNumber',
//             B: 'teamOne',
//             C: 'teamTwo',
//             D: 'lockInTS'
//         }
//     })
//     return xlObject.Sheet1
// }

// // Process the above array so that team._ids are pulled and lockIn is a timestamp
// const processArray = async (rawArray) => {
//     processedArray = []
//     const teams = await Team.find()
//     rawArray.forEach((fixture) => {
//         const fixtureObject = {}
//         fixtureObject.matchNumber = fixture.matchNumber
//         for (i=0; i<teams.length; i++) {
//             if (teams[i].name === fixture.teamOne) {
//                 fixtureObject.team1 = teams[i]._id
//             }
//         }
//         for (i=0; i<teams.length; i++) {
//             if (teams[i].name === fixture.teamTwo) {
//                 fixtureObject.team2 = teams[i]._id
//             }
//         }
//         fixtureObject.lockIn = new Date(fixture.lockInTS)
//     processedArray.push(fixtureObject)
//     })
//     return processedArray
// }

// // Upload a fixture to db
// const uploadFixture = async (fixtureObj) => {
//     const fixture = new Fixture(fixtureObj)
//     try {
//         await fixture.save()
//     } catch {
//         console.log('Upload error')
//     }  
// }

// parseExcel().then((xl) => {
//     processArray(xl).then((finalArray) => {
//         finalArray.forEach((fixtureObj) => {
//             uploadFixture(fixtureObj)
//         })
//     })
// })
