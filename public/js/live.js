// Validate user by getting token for the page
const token = getToken()
if (!token) {
    window.location.replace("login.html")
}

const displayHeader = (name1, name2) => {
    document.querySelector('#match-title').textContent = `${name1} vs ${name2}`
}

const showUserSquad = (squad, teamData) => {
    squad.sort((a, b) => b.player.price - a.player.price)
    let squadString = ''
    squad.forEach((line, index) => {
        squadString += `${index + 1}. `
        const player = line.player
        let oName = player.longName
        if (player.overseas) {
            oName += ' (O)'
        }
        let teamName = ''
        if (player.team === teamData.id1) {
            teamName = teamData.name1
        } else if (player.team === teamData.id2) {
            teamName = teamData.name2
        }
        squadString += `${oName} | ${teamName} | ${player.skill} | ${player.price}K`
        if (line.batStar) {
            squadString += ' | Bat*'
        }
        if (line.bowlStar) {
            squadString += ' | Bowl*'
        }
        squadString += '\n'
    })
    alert(squadString)
}

const renderAllSquads = (squads, teamData) => {
    const $userList = document.querySelector('#live-squads')
    squads.forEach((user, index) => {
        const $userLink = document.createElement('p')
        $userLink.textContent = `${index + 1}. ${user.user.username}`
        $userLink.style.cursor = 'pointer'
        $userLink.addEventListener('click', () => {
            showUserSquad(user.squad, teamData)
        })
        $userList.appendChild($userLink)
    })
}

// Fetch last locked game and then fetch all the saved squads for that and render
getLastLocked().then((data) => {
    displayHeader(data.team1.longName, data.team2.longName)
    const teamData = {
        id1: data.team1._id,
        name1: data.team1.name,
        id2: data.team2._id,
        name2: data.team2.name
    }
    fetchAllSquads(data._id).then((allSquads) => {
        renderAllSquads(allSquads, teamData)
    })
})