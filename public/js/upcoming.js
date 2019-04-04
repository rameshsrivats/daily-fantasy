const $fixtureList = document.querySelector('#upcoming-list')

// Validate user by getting token for the page
const token = getToken()
if (!token) {
    window.location.replace("login.html")
}

// Fetch and display the user summary
getUserSummary().then(({ username, matchPoints, rank}) => {
    const $userSummary = document.querySelector('#user-summary')
    
    const $hello = document.createElement('h1')
    $hello.textContent = `Hello ${username}`
    $userSummary.appendChild($hello)
    
    const $performance = document.createElement('h3')
    $performance.textContent = `Rank: ${rank}. Match Points: ${matchPoints}.   `
    $userSummary.appendChild($performance)  
})

// Handle user actions
document.querySelector('#actions').addEventListener('change', (e) => {
    switch (e.target.value) {
        case 'edit-profile':
            location.assign('edit-profile.html')
            break
        case 'change-pass':
            location.assign('change-pass.html')
            break
        case 'logout':
            logout().then(() => {
                window.location.replace("login.html")
            })
            break
        case 'logout-all':
            logoutAll().then(() => {
                window.location.replace("login.html")
            })
            break
    }
})

// Fetch and display the upcoming fixtures
const renderFixture = ({ _id, team1: { longName: name1, name: t1 } , team2: {longName: name2, name: t2}, lockIn, hasSquad }) => {
    const $fixture = document.createElement('div')
    $fixture.style.marginBottom = "50px"
    
    const $time = document.createElement('p')
    $time.textContent = `${moment(lockIn).format('ddd Do MMM h:mm a')}`
    $fixture.appendChild($time)

    const $match = document.createElement('h3')
    $match.textContent = `${name1} vs ${name2}`
    $fixture.appendChild($match)

    const $status = document.createElement('span')
    const $action = document.createElement('button')
    $action.style.cursor = "pointer"
    if (hasSquad) {
        $status.style.color = 'green'
        $status.textContent = 'You have a squad' + '\xa0\xa0\xa0\xa0'
        $action.textContent = 'Edit'
    } else {
        $status.style.color = 'red'
        $status.textContent = 'You do not have a squad' + '\xa0\xa0\xa0\xa0'
        $action.textContent = 'Create'
    }
    $fixture.appendChild($status)
    $fixture.appendChild($action)

    // Event listener for create/edit button
    $action.addEventListener('click', (e) => {
        
        // Pass parameters to edit squad through a query string
        const destination = 'edit-squad.html'
        const qs1 = `?id=${_id}`
        const qs2 = `team1=${name1}`
        const qs3 = `team2=${name2}`
        const qs4 = `time=${lockIn.toString()}`
        const qs5 = `t1=${t1}`
        const qs6 = `t2=${t2}`
        const qs7 = `hs=${hasSquad.toString()}`

        const editPage = destination + qs1 + '&' + qs2 + '&' + qs3 + '&' + qs4 + '&' + qs5 + '&' + qs6 + '&' + qs7
        location.assign(editPage)
    })
    $fixtureList.appendChild($fixture)   


}

// Fetch upcoming matches
getUpcoming(token).then((result) => {
    getUserFixtures().then((userFixtures) => {
        result.upcoming.forEach((fixture) => {
            fixture.hasSquad = false
            userFixtures.forEach((userFixture) => {
                if (userFixture.fixture === fixture._id) {
                    fixture.hasSquad = true
                }
            })
            renderFixture(fixture)
        })
    })  
})