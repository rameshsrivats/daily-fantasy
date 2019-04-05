// All requests to the back-end
// Requires: auth 

// Create Header object for requests
const createHeaders = (token) => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    if (token) {
        const bearer = 'Bearer ' + token
        myHeaders.append('Authorization', bearer)
    }
    return myHeaders
}

// Validate token and return role
const getRole = async () => {
    const token = getToken()
    if (!token) {
        return undefined
    }
    const url = '/users/role'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    try {
        const response = await fetch(url, myInit)
        if (response.ok) {
            const data = await response.json()
        return data.role
        } else {
            deleteToken()
            return undefined
        }
        
    } catch (e) {
        return undefined
    }    
}

// Register new user
const register = async (email, password) => {
    const url = '/users'
    const myHeaders = createHeaders()
    const body = { email, password } //How do we avoid passing this as plain text? 
    const myInit = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(body)
    }
    try {
        const response = await fetch(url, myInit)
        const data = await response.json()
        if (response.ok) {      
            console.log('data', data.token)
            saveToken(data.token)
            return {success: true}
        } else {
            return {error: data.error}
        } 
    } catch (e) {
        return {error: e.message}
    } 
}

// Login existing user
const login = async (email, password) => {
    const url = '/users/login'
    const myHeaders = createHeaders()    
    const body = { email, password }
    const myInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify(body)
    }
    try {
        const response = await fetch(url, myInit)
        const data = await response.json()
        if (response.ok) {
            saveToken(data.token)
            return {role: data.role}
        } else {
            return {error: data.error}
        }
    } catch (e) {
        return { error: 'Unable to connect to server. Please try again later' }
    }
}

// Pick username for new user
const pickUsername = async (username) => {
    const token = getToken()
    const url = '/users/username'
    const myHeaders = createHeaders(token)
    const body = { username }
    const myInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify(body)
    }
    try {
        const response = await fetch(url, myInit)
        const data = await response.json()
        if (response.ok) {
            return { role: data.role }
        } else {
            return { error: data.error }
        }
    } catch (e) {
        return { error: 'Unable to connect to server. Please try again later' }
    }
}

// Get Username, match points and rank
const getUserSummary = async () => {
    const token = getToken()
    const url = '/users/summary'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    try {
        const response = await fetch(url, myInit)
        if (response.ok) {
            return await response.json()
        } else {
            return undefined
        }
    } catch (e) {
        return { error: 'Unable to connect to server. Please try again later' }
    }
}

// Logout
const logout = async () => {
    const token = getToken()
    const url = '/users/logout'
    const myHeaders = createHeaders(token) 
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    }
    await fetch(url, myInit)
}

// Logout all devices
const logoutAll = async () => {
    const token = getToken()
    const url = '/users/logout-all'
    const myHeaders = createHeaders(token) 
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    }
    await fetch(url, myInit)
}

// Get upcoming matches 
const getUpcoming = async () => {
    const token = getToken()
    const url = '/fixtures/upcoming'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    const response = await fetch(url, myInit)
    if (response.ok) {
        return await response.json()
    } else {
        return undefined
    }
}

// Get all fixtures in which a user has a squad
const getUserFixtures = async () => {
    const token = getToken()
    const url = '/users/fixtures'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    try {
        const response = await fetch(url, myInit)
        if (response.ok) {
            return await response.json()
        } else {
            return []
        }
    } catch (e) {
        return []
    }
}

// Fetch the roster for a particular fixture
const fetchRoster = async (id) => {
    const token = getToken()
    const url = '/fixtures/' + id + '/players'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    try {
        const response = await fetch(url, myInit)
        if (response.ok) {
            return await response.json()
        } else {
            return undefined
        }
    } catch (e) {
        return undefined
    }    
}

// Fetch the user's saved squad for a fixture
const fetchSquad = async (id) => {
    const token = getToken()
    const url = '/squads/' + id + '/me'
    const myHeaders = createHeaders(token)
    const myInit = {
        method: 'GET',
        headers: myHeaders
    }
    try {
        const response = await fetch(url, myInit)
        if (response.ok) {
            return await response.json()
        } else {
            return undefined
        }
    } catch (e) {
        return undefined
    }
}

// Save user's squad
const saveSquad = async (id, fullSquad) => {
    const token = getToken()
    let squad = fullSquad.map(({_id, batStar, bowlStar}) => {   // This part should move out
        return {
            player: _id,
            batStar,
            bowlStar
        }
     })
     const url = '/squads/' + id
     const myHeaders = createHeaders(token)
     const myInit = {
        method: 'PUT',   // should be post if new squad and put if old squad
        headers: myHeaders,
        body: JSON.stringify(squad)
    }
    try {
        const response = await fetch(url, myInit)
        return await response.json()
    } catch (e) {
        return { message: 'Your squad has not been saved. Could not connect to server' }
    }
}

