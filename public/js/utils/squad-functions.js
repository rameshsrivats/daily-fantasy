// Functions related to squad display and processing

// Assign numerical values to skill for sorting squad
const getVal = function (str) {
    switch (str) {
        case 'BAT':
            return 0
            break
        case 'AR':
            return 1
            break
        case 'KEEP':
            return 2
            break
        case 'BOWL':
            return 3
            break
        default:
            return 4
    }
}

// Sort squad for display as per skill and price
const sortSquad = (squad) => {
    return squad.sort((a, b) => {
        if (a.skill !== b.skill) {
            return getVal(a.skill) - getVal(b.skill)
        }
        return b.price - a.price
    })
}

// Return all validity parameters for a squad
const getParams = (squad, team1, team2) => {
    const params = {
        valid: true,
        budget: {
            left: 1000,
            ok: true
        },
        players: {
            count: 0,
            ok: true
        },
        bat: {
            count: 0,
            ok: true
        },
        ar: {
            count: 0,
            ok: true
        },
        keep: {
            count: 0,
            ok: true
        },
        bowl: {
            count: 0,
            ok: true
        },
        t1: {
            count: 0,
            ok: true
        },
        t2: {
            count: 0,
            ok: true
        },
        overseas: {
            count: 0,
            ok: true
        },
        batStar: true,
        bowlStar: true
    }
    // Check budget
    const budget = 1000
    const spent = squad.reduce((total, member) => total + member.price, 0)
    params.budget.left = budget - spent
    if (spent > budget) {
        params.budget.ok = false
        params.valid = false
    }

    // Check number of players
    params.players.count = squad.length
    if (params.players.count !== 11) {
        params.players.ok = false
        params.valid = false
    }
    
    // Check skill balance
    
    const bats = squad.filter((member) => member.skill === 'BAT').length
    params.bat.count = bats
    if (bats < 3) {
        params.bat.ok = false
        params.valid = false
    }

    const bowls = squad.filter((member) => member.skill === 'BOWL').length
    params.bowl.count = bowls
    if (bowls < 3) {
        params.bowl.ok = false
        params.valid = false
    }
    
    const ars = squad.filter((member) => member.skill === 'AR').length
    params.ar.count = ars
    if (ars < 1) {
        params.ar.ok = false
        params.valid = false
    }

    const keeps = squad.filter((member) => member.skill === 'KEEP').length
    params.keep.count = keeps
    if (keeps < 1) {
        params.keep.ok = false
        params.valid = false
    }
    
    // Check team spread
    
    const team1s = squad.filter((member) => member.team === team1).length
    params.t1.count = team1s
    if (team1s > 7) {
        params.t1.ok = false
        params.valid = false
    }

    const team2s = squad.filter((member) => member.team === team2).length
    params.t2.count = team2s
    if (team2s > 7) {
        params.t2.ok = false
        params.valid = false
    }

    // Check overseas
    const oseas = squad.filter((member) => member.overseas).length
    params.overseas.count = oseas
    if (oseas > 4) {
        params.overseas.ok = false
        params.valid = false
    }

    // Check for batting & bowling stars
    if (!squad.find((member) => member.batStar)) {
        params.batStar = false
        params.valid = false
    }
    if (!squad.find((member) => member.bowlStar)) {
        params.bowlStar = false
        params.valid = false
    }

    return params
}


// Process others as per filters
const processFilters = (others, filters) => {
    // Filter by search string (look at full name)
    if (filters.searchString !== '') {
        others = others.filter((player) => player.longName.toLowerCase().includes(filters.searchString.toLowerCase()))
    }

    // Filter by team
    if (filters.teamFilter !== 'ALL') {
        others = others.filter((player) => player.team === filters.teamFilter)
    }

    // Filter by skill
    if (filters.skillFilter !== 'ALL') {
        others = others.filter((player) => player.skill === filters.skillFilter)
    }

    // Sort by sort field
    switch (filters.sortBy) {
        case 'PRICE DOWN':
            others = others.sort((a, b) => b.price - a.price)
            break
        case 'PRICE UP':
            others = others.sort((a, b) => a.price - b.price)
            break
        default:
            others = others.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1
                } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1
                } else {
                    return 0
                }
            })
    }

    return others
}

// Check if current squad is same as original squad.
// This function will only be called when current squad is valid, so can assume 11 players, etc.
const sameSquad = (curSquad, origSquad) => {
    curSquad.sort((a, b) => {
        if (a._id < b._id) {
            return -1
        } else {
            return 1
        }
    })
    origSquad.sort((a, b) => {
        if (a._id < b._id) {
            return -1
        } else {
            return 1
        }
    })
    for ( i = 0; i < 11; i++ ) {
        if (curSquad[i]._id !== origSquad[i]._id) {
            return false
        } else if ( curSquad[i].batStar ? !origSquad[i].batStar : origSquad[i].batStar) {
            return false
        } else if ( curSquad[i].bowlStar ? !origSquad[i].bowlStar : origSquad[i].bowlStar) {
            return false
        }
    }
    return true
}

// Generate error string for invalid squads
const getErrorString = ({ players, budget, bat, ar, bowl, keep, overseas, t1, t2, batStar, bowlStar}, team1, team2) => {
    if (players.count !== 11)
    {
        if (players.count < 10) {
            return `Pick ${ 11 - players.count } more players.`
        }
        if (players.count === 10) {
            return 'Pick one last player.'
        }
        if (players.count === 12) {
            return 'You have one player too many.'
        }
        if (players.count > 12 ) {
            return `Drop ${players.count - 11} players.`
        }
    } 
    if (!(ar.ok && bat.ok && bowl.ok && keep.ok && overseas.ok && t1.ok && t2.ok)) {
        let errorString = ''
        let hasFew = false
        let hasMany = false
        if (!(bat.ok && bowl.ok && ar.ok && keep.ok)) {
            hasFew = true
            errorString += 'Too few:'
            if (!bat.ok) {
                errorString += ' Batsmen,'
            }
            if (!ar.ok) {
                errorString += ' All-Rounders,'
            }
            if (!keep.ok) {
                errorString += ' Keepers,'
            }
            if (!bowl.ok) {
                errorString += ' Bowlers,'
            }    
        }
        if (hasFew) {
            errorString = errorString.slice(0, -1) + '. '
        }
        if (!(overseas.ok && t1.ok && t2.ok)) {
            hasMany = true
            errorString += 'Too many:'
            if (!overseas.ok) {
                errorString += ' Overseas players,'
            }
            if (!t1.ok) {
                errorString += ` ${team1} players,`
            }
            if (!t2.ok) {
                errorString += ` ${team2} players,`
            }
        }
        if (hasMany) {
            errorString = errorString.slice(0, -1) + '.'
        }
        return errorString
    }
    if (!budget.ok) {
        return 'You have exceeded the budget.'
    }
    if (!(batStar || bowlStar)) {
        return 'Pick your Batting & Bowling Stars'
    }
    if (!batStar) {
        return 'Pick a Batting Star'
    }
    if (!bowlStar) {
        return 'Pick a Bowling Star'
    }
    return 'Something went wrong. Please send feedback'
}


