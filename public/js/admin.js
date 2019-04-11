// Check if user is logged in
const token = getToken()
if (!token) {
    window.location.replace("login.html")
}

const role = getRole()
if (role !== 'admin') {
    document.body.innerHTML = ''
    window.alert('You are not authorized to view this page')
    window.location.href='upcoming.html'    
}