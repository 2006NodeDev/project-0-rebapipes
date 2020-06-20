import express from 'express'

const app = express() //completed app

app.listen(2006, () => {
    console.log('Server has started');
})