const fs = require('fs')
const path = require('path')
const BSON = require('bson')

const bson = new BSON()
const content = bson.deserialize(fs.readFileSync(path.resolve(__dirname, 'bds-prod/admins.bson')))
console.log(content._id.id)
