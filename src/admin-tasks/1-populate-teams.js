
// const excelToJson = require('convert-excel-to-json')


// // Create an excel sheet with no headers
// // This converts it an object (return) with attribute (filename) which is an array of objects for each row 
// const teamArray = excelToJson({
//     sourceFile: '/Users/ramesh/Documents/Fantasy/teams.xlsx',
//     columnToKey: {
//         A: 'name',
//         B: 'longName'
//     }
// })

// console.log(teamArray)

// // Function to push the values into db
// const pushTeam = async (team) => {
//     const teamDoc = new Team(team)
//     console.log(teamDoc)
//     try {
//         await teamDoc.save()
//         return 'done'
//     } catch {
//         return 'problem'
//     }  
// }

// teamArray.teams.forEach((team) => {
//     pushTeam(team)
// })
