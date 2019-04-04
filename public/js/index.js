// Check is user has a valid token, If so, send to upcoming, else to login.

getRole().then((role) => {
    if (role) {
        const qs = `?role=${role}`
        window.location.replace('upcoming.html' + qs)
    } else {
        window.location.replace('login.html')
    }
})
