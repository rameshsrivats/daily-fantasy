// Related to token storage. Need to add security features.

// Saves token to local storage
const saveToken = (token) => {
    localStorage.setItem('daily-fantasy-token', token)
}

// Get token from local storage
const getToken = () => {
    return localStorage.getItem('daily-fantasy-token')
}

// Delete token from local storage
const deleteToken = () => {
    localStorage.removeItem('daily-fantasy-token')
}


