require('./db/mongoose.js')
const cors = require('cors')
const express = require('express')
const handicapRoute = require('./routers/handicapRoutes')
const volunteerRoute = require('./routers/volunteerRoutes')
const helpRoute = require('./routers/helpRoutes')
const app = express()
const PORT = process.env.PORT || 3005

app.use(cors())

app.use(express.json())
app.use(handicapRoute)
app.use(volunteerRoute)
app.use(helpRoute)



app.listen(PORT, () => console.log(`Server is runnig on port: ${PORT}`))