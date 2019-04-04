// Validate User and get token for the page
const token = getToken()
if (!token) {
    window.location.replace("login.html")
}

// Get fixture parameters from url
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
const name1 = urlParams.get('team1')
const name2 = urlParams.get('team2') 
const time = urlParams.get('time')
const team1 = urlParams.get('t1')
const team2 = urlParams.get('t2')
const hs = urlParams.get('hs')
const hasSquad = hs === 'true'

// Render match title 
document.querySelector('#match-title').textContent = `${name1} vs ${name2}`

// Render countdown clock
const $countdown = document.querySelector('#match-lockIn')
$countdown.textContent = 'Locks in'
const lockIn = new Date(time).getTime()
const countdown = setInterval(() => {
    const now = new Date().getTime()
    const distance = lockIn - now
    const days = Math.floor( distance / (1000 * 24 * 60 * 60 * 1000))
    const hours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((distance % (60 * 1000)) / (1000))
    let countDownString = 'Locks in'
    if (days > 0) {
        countDownString += ` ${days}d`
    }
    if (!((hours === 0) && (days === 0))) {
        countDownString += ` ${hours}h`
    }
    if (!((minutes === 0) && (hours === 0) && (days ===0))) {
        countDownString += ` ${minutes}m`
    }
    countDownString += ` ${seconds}s`
    $countdown.textContent = countDownString

    if (distance < 0) {
        clearInterval(countdown)
        $countdown.style.color = 'red'
        $countdown.textContent = 'Match Locked'
    }
}, 1000)

// Declare global stuff
const $break = document.createElement('p')
$break.textContent = ''
let squad = []
let originalSquad = [] // for reset
let roster = []
let others = []
let originalOthers = [] // for reset
let filters = {
    searchString: '',
    sortBy: 'NAME',
    teamFilter: 'ALL',
    skillFilter: 'ALL'
}

// Define Rules panel contents
const $rulesText = document.createElement('div')
const squadRules = [
    '1. Budget 1,000K',
    '2. Pick 11 players.',
    '3. Minimum 3 batsmen, 3 bowlers, 1 all-rounder and 1 keeper.',
    '4. Maximum of 4 overseas players',
    '5. Maximum of 7 players from a single team'
]
const $rulesHeading = document.createElement('h3')
$rulesHeading.textContent = 'Squad Composition'
$rulesText.appendChild($rulesHeading)
for (i=0; i<squadRules.length; i++) {
    const $rulePoint = document.createElement('p')
    $rulePoint.textContent = squadRules[i]
    $rulesText.appendChild($rulePoint)
}
const $closeButton = document.createElement('button')
$closeButton.textContent = 'Close'
$rulesText.appendChild($closeButton)

// Manage rules panel
const $rulesPanel = document.querySelector('#rules-panel')
const $rules = document.querySelector('#rules')
$rules.style.textDecoration = "underline"
$rules.style.cursor = "pointer"
$rules.addEventListener('click', () => {
    $rulesPanel.appendChild($rulesText)
    $rulesPanel.appendChild($break)
    $closeButton.addEventListener('click', () => {
        $rulesPanel.innerHTML = ''
    })
})

// Populate team-filter drop-down and add event listener
const $teamFilter = document.querySelector('#team-filter')
const $option1 = document.createElement('option')
$option1.textContent = team1
$teamFilter.appendChild($option1)
const $option2 = document.createElement('option')
$option2.textContent = team2
$teamFilter.appendChild($option2)
$teamFilter.addEventListener('change', function (e) {
    filters.teamFilter = e.target.value
    renderOthers()
})

// Event handler for search bar
const $searchString = document.querySelector('#search-string')
$searchString.addEventListener('input', function (e) {
    filters.searchString = e.target.value
    renderOthers()
})

//Event handler for sort
const $sortBy = document.querySelector('#sort-by')
$sortBy.addEventListener('change', function(e) {
    filters.sortBy = e.target.value
    renderOthers()
})

// Event handler for skill filter
const $skillFilter = document.querySelector('#skill-filter')
$skillFilter.addEventListener('change', function(e) {
    filters.skillFilter = e.target.value
    renderOthers()
})

// Dump the entire roster into the global others array. Subtract curSquad later.
const initOthers = (roster) => {
    roster.forEach((player) => {
        const newPlayer = {
            ...player
        }
        newPlayer.team = player.team.name
        delete newPlayer.pointsBreakup
        newPlayer.batting = player.pointsBreakup.batting
        newPlayer.bowling = player.pointsBreakup.bowling
        newPlayer.fielding = player.pointsBreakup.fielding
        newPlayer.bonus = player.pointsBreakup.bonus
        newPlayer.batStar = false
        newPlayer.bowlStar = false
        others.push(newPlayer)        
    })
}

// Initialize global squad array from curSquad. 
// Pick from global others array & delete that item in others
// Also create orginalSquad and originalOthers so user can reset
const initSquad = (curSquad) => {
    curSquad.forEach((member) => {
        const ind = others.findIndex((player) => player._id === member.player)
        const newMember = {
            ...others[ind]
        }
        if (member.batStar) {
            newMember.batStar = true
        }
        if (member.bowlStar) {
            newMember.bowlStar = true
        }
        squad.push(newMember)
        others.splice(ind, 1)
    })
}

// Pick a player i.e. move him from others to squad
const pickPlayer = (id) => {
    const ind = others.findIndex((player) => player._id === id)
    squad.push(others[ind])
    others.splice(ind, 1)
    renderSquad()
    renderOthers()
}

// Drop a member i.e. move him from squad to others
const dropMember = (id) => {
    const ind = squad.findIndex((member) => member._id === id )
    others.push(squad[ind])
    squad.splice(ind, 1)
    renderSquad()
    renderOthers()
}

// Set a player as batting star and wipe out earlier batting star
const setBatStar = (id) => {
    squad.forEach((member) => {
        member.batStar = false
        if (member._id === id) {
            member.batStar = true
        }
    })
    others.forEach((player) => {
        player.batStar = false
    })
    renderSquad()
    renderOthers()
}

// Set a player as bowling star and wipe out earlier bowling star
const setBowlStar = (id) => {
    squad.forEach((member) => {
        member.bowlStar = false
        if (member._id === id) {
            member.bowlStar = true
        }
    })
    others.forEach((player) => {
        player.bowlStar = false
    })
    renderSquad()
    renderOthers()
}

// Check if user has batting star
const getBatStar = () => squad.find((member) => member.batStar)

// Check if user has bowling star
const getBowlStar = () => squad.find((member) => member.bowlStar)


// All dom functions. Array processing is done in squad-functions.js

// Generate DOM to display a single player without the button
const generatePlayerDOM = (player, num) => {
    const $player = document.createElement('div')
    $player.style.lineHeight = "1.5em"
    let oName = player.name
    if (player.overseas) {
        oName += ' (O)'
    }
    $player.textContent = `${num + 1}. ${oName} | ${player.team} | ${player.skill} | ${player.totalPoints} pts | ${player.price}K` + '\xa0\xa0\xa0'
    if (player.batStar) {
        $isBatStar = document.createElement('span')
        $isBatStar.textContent = 'Bat*' + '\xa0\xa0\xa0'
        $isBatStar.style.color = "blue"
        $player.appendChild($isBatStar)
    }
    if (player.bowlStar) {
        $isBowlStar = document.createElement('span')
        $isBowlStar.textContent = 'Bowl*' + '\xa0\xa0\xa0'
        $isBowlStar.style.color = "blue"
        $player.appendChild($isBowlStar)
    }
    return $player
}

// Render each member of squad
const renderMemberDOM = (member, num) => {
    const $member = generatePlayerDOM(member, num)

    $dropButton = document.createElement('button')
    $dropButton.textContent = 'Drop'
    $dropButton.style.cursor = "pointer"
    $member.appendChild($dropButton)
    $dropButton.addEventListener('click', () => {
        dropMember(member._id)
    })
    $squad.appendChild($member)
}

// Render signal lights & budget left
renderParams = (params) => {
    paramArray = Object.keys(params)
    $signalStrip = document.createElement('p')
    paramArray.forEach((param, index) => {
        if (index > 2 && index < 7) {   // Only skills
            const $paramSpan = document.createElement('span')
            $paramSpan.textContent = `${param.toUpperCase()}: ${params[param].count} | `
            if (params[param].ok) {
                $paramSpan.style.color = "green"
            } else {
                $paramSpan.style.color = "red"
            }
            $signalStrip.appendChild($paramSpan)
        }
    })
    
    const $paramT1 = document.createElement('span')
    $paramT1.textContent = `${team1}: ${params.t1.count} | `
    if (params.t1.ok) {
        $paramT1.style.color = "green"
    } else {
        $paramT1.style.color = "red"
    }
    $signalStrip.appendChild($paramT1)

    const $paramT2 = document.createElement('span')
    $paramT2.textContent = `${team2}: ${params.t2.count} | `
    if (params.t2.ok) {
        $paramT2.style.color = "green"
    } else {
        $paramT2.style.color = "red"
    }
    $signalStrip.appendChild($paramT2)

    const $paramO = document.createElement('span')
    $paramO.textContent = `(O): ${params.overseas.count}`
    if (params.overseas.ok) {
        $paramO.style.color = "green"
    } else {
        $paramO.style.color = "red"
    }
    $signalStrip.appendChild($paramO)
    
    $squad.appendChild($signalStrip)

    const $budgetLeft = document.createElement('p')
    if (params.budget.left >= 0) {
        $budgetLeft.textContent = `You have ${params.budget.left}K remaining.`
    } else {
        $budgetLeft.textContent = `You have exceeded your budget by ${-params.budget.left}K`
        $budgetLeft.style.color = "red"
    }
    $budgetLeft.style.fontWeight = 'bold';
    $squad.appendChild($budgetLeft)
}

// Renders the batting & bowling star dropdowns
const renderStarSelect = () => {
    const $starStrip = document.createElement('div')
    $starStrip.style.lineHeight = "3.0em"

    
    // Batting Star dropdown
    const $batStarText = document.createElement('span')
    $batStarText.textContent = 'Batting Star: '
    $starStrip.appendChild($batStarText)

    const $batStarDropdown = document.createElement('select')
    
    const $batStarNone = document.createElement('option')
    $batStarNone.textContent = 'None'
    $batStarNone.style.color = 'red'
    $batStarNone.value = 'none'
    hasBatStar = squad.find((member) => member.batStar)
    if (!hasBatStar) {
        $batStarNone.selected = true
    }
    $batStarDropdown.appendChild($batStarNone)
    
    squad.forEach((member) => {
        const $batStarOption = document.createElement('option')
        $batStarOption.textContent = member.name
        $batStarOption.value = member._id
        if (member.batStar) {
            $batStarOption.selected = true
        }
        $batStarDropdown.appendChild($batStarOption)
    })
    // Event listener for batting star
    $batStarDropdown.addEventListener('change', (e) => {
        setBatStar(e.target.value)
    })
    
    $starStrip.appendChild($batStarDropdown)

    // Bowling Star dropdown
    const $bowlStarText = document.createElement('span')
    $bowlStarText.textContent = '\xa0\xa0\xa0' + 'Bowling Star: '
    $starStrip.appendChild($bowlStarText)

    const $bowlStarDropdown = document.createElement('select')
    
    const $bowlStarNone = document.createElement('option')
    $bowlStarNone.textContent = 'None'
    $bowlStarNone.value = 'none'
    hasBowlStar = squad.find((member) => member.bowlStar)
    if (!hasBowlStar) {
        $bowlStarNone.selected = true
    }
    $bowlStarDropdown.appendChild($bowlStarNone)
    
    squad.forEach((member) => {
        const $bowlStarOption = document.createElement('option')
        $bowlStarOption.textContent = member.name
        $bowlStarOption.value = member._id
        if (member.bowlStar) {
            $bowlStarOption.selected = true
        }
        $bowlStarDropdown.appendChild($bowlStarOption)
    })
    // Event listener for bowlting star
    $bowlStarDropdown.addEventListener('change', (e) => {
        setBowlStar(e.target.value)
    })
    
    $starStrip.appendChild($bowlStarDropdown)

    $squad.appendChild($starStrip)
}

// Renders the reset button, and either the save button or error message
const renderSaveStrip = (params) => {
    const $saveStrip = document.createElement('div')
    
    // Handle reset to go back to last saved squad
    const $resetButton = document.createElement('button')
    $resetButton.textContent = 'Reset'
    $saveStrip.appendChild($resetButton)
    $resetButton.addEventListener('click', () => {
        // Deep copy squad and others from their originals
        squad = originalSquad.map(a => ({...a}))
        others = originalOthers.map(a => ({...a}))
        renderSquad()
        renderOthers()
    })

    const $bottomMessage = document.createElement('span')
    // If squad is invalid print error message
    if (!params.valid) {
        $bottomMessage.style.color = 'red'
        $bottomMessage.textContent = '\xa0\xa0\xa0' + getErrorString(params, team1, team2)
        $saveStrip.appendChild($bottomMessage)
    } else if (sameSquad(squad, originalSquad)) { // If no changes made, remove reset button and print message
        $bottomMessage.textContent = 'No changes made to squad' + '\xa0\xa0\xa0'
        $saveStrip.innerHTML =''
        $saveStrip.appendChild($bottomMessage)
        // Add a back button
        const $backButton = document.createElement('button')
        $backButton.textContent = 'Back'
        $backButton.style.cursor = 'pointer'
        $saveStrip.appendChild($backButton)
        $backButton.addEventListener('click', () => {
                window.location.assign("upcoming.html")
        })
    } else { // Success message and save button     
        $bottomMessage.style.color = "green"
        $bottomMessage.textContent = '\xa0\xa0\xa0' + 'Your squad looks good' + '\xa0\xa0\xa0'
        $saveStrip.appendChild($bottomMessage)

        // Add save button to save squad
        const $saveButton = document.createElement('button')
        $saveButton.textContent = 'Save'
        $saveButton.style.cursor = 'pointer'
        $saveStrip.appendChild($saveButton)
        $saveButton.addEventListener('click', () => {
            saveSquad(id, squad).then((result) => {
                window.alert(result.message)
                window.location.href='upcoming.html'
            }) 
        })
    }
    
    $squad.appendChild($saveStrip)
}



// Render squad from global squad array
const $squad = document.querySelector('#cur-squad')
const renderSquad = () => {
    $squad.innerHTML = ''
    if (squad.length === 0) {
        
        const $emptyMessage = document.createElement('h3')
        $emptyMessage.style.lineHeight = "10em"
        $emptyMessage.textContent = 'You have no squad. Start picking.'
        $squad.appendChild($emptyMessage)
       
    } else {
        const params = getParams(squad, team1, team2)
        renderParams(params)
        squad = sortSquad(squad)
        squad.forEach((member, index) => {
            renderMemberDOM(member, index)
        })
        renderStarSelect()
        renderSaveStrip(params)
    }
}

// Render DOM for each indiviudal player from others
const renderPlayerDOM = (player, num) => {
    const $player = generatePlayerDOM(player, num)
    $pickButton = document.createElement('button')
    $pickButton.textContent = 'Pick'
    $pickButton.style.cursor = "pointer"
    $player.appendChild($pickButton)
    $others.appendChild($player)
    $pickButton.addEventListener('click', () => {
        pickPlayer(player._id)
    })
}

// Render others based on global others array and global filters
const $others = document.querySelector('#other-players')
const renderOthers = () => {
    $others.innerHTML = ''
    const processedOthers = processFilters(others, filters)
    const $playerCount = document.createElement('p')
    let plural = 'players'
    if (processedOthers.length === 1) {
        plural = 'player'
    }
    $playerCount.textContent = `You have ${processedOthers.length} ${plural} to choose from`
    $others.appendChild($playerCount)
    processedOthers.forEach((player, index) => {
        renderPlayerDOM(player, index)
    })

}

// Fetch all data needed and render

fetchRoster(id).then((roster) => {
    // Initialize global others array with all players from the roster
    initOthers(roster)
    fetchSquad(id).then((curSquad) => {
       if (!curSquad.empty) {
           // Initialize global squad array with curSquad and delete those from others
           initSquad(curSquad.squad)
       }
       // Deep copy squad and others into 'original' arrays for reset and squad change check
       originalSquad = squad.map(a => ({...a}))
       originalOthers = others.map(a => ({...a}))
       renderSquad()
       renderOthers()
   })    
}).catch(()=> {
    console.log('Could not fetch roster')
    // Redirect to 500 error page
})

    
