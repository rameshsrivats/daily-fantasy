// Pick username for new user
// Requires auth, api

const token = getToken()
if (!token) {
    window.location.replace("login.html")
}

const $usernameError = document.querySelector('#username-error')
$usernameError.style.color = "red"
document.querySelector('#pick-username').addEventListener('submit', (e) => {
    e.preventDefault()
    $usernameError.innerHTML = ''
    pickUsername(e.target.username.value).then((data) => {
        if (data.error) {
            $usernameError.textContent = data.error
        }
        else {
            const qs = `?role=${data.role}`
            window.location.replace('upcoming.html' + qs)
        }
    })
})
