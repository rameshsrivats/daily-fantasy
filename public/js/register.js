// Register
// Requires - auth, api

const $registerError = document.querySelector('#register-error')
$registerError.style.color = "red"
document.querySelector('#register').addEventListener('submit', (e) => {
    e.preventDefault()
    $registerError.innerHTML = ''
    register(e.target.email.value, e.target.password.value).then((data) => {
        if (data.error) {
            $registerError.textContent = data.error
        } else {
            window.location.replace("username.html")
        }
    })
})