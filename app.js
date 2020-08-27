const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.post("/onboard", (req, res) => {
    console.log(req.body) 
    res.status(200).end() 
  })

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))