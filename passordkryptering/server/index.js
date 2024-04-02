const express = require('express')
const app = express()
const port = 3001
var cors = require("cors");
app.use(express.json())

app.use(cors())

function Hash(input) {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash &= hash;
  }
  return hash;
}

app.post('/hash', async (req, res) => {
  const { Password } = await req.body
  res.send(Hash(Password).toString())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})