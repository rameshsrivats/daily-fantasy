const path = require('path')
const express = require('express')
require('./db/mongoose')
userRouter = require('./routers/user')
fixtureRouter = require('./routers/fixture')
squadRouter = require('./routers/squad')
// squadRouter = require('./routers/squad')

const app = express()
const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath))

app.use(express.json())
app.use(userRouter)
app.use(fixtureRouter)
app.use(squadRouter)


app.listen(port, () => {
    console.log('Server is up on port:' + port)
})