// Login
// Require auth, api

const $emailError = document.querySelector('#login-error')
$emailError.style.color = "red"
document.querySelector('#login').addEventListener('submit', (e) => {
    e.preventDefault()
    $emailError.innerHTML = ''
    login(e.target.email.value, e.target.password.value).then((data) => {
        if (data.error) {
            $emailError.textContent = data.error             
        } else {
            const qs = `?role=${data.role}`
            window.location.replace('upcoming.html' + qs)
        }
    })
})