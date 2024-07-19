import express from 'express';
const app = express();

let cnt = 0;


app.get('/', (req, res) => {
    const minus = Number(req.query.minus);
    if (Number.isInteger(minus)) {
        cnt -= minus;
    } else {
        cnt += 1;
    }
    console.log(req.query);
    return res.send(`
        <h1> Ciao Marco </h1> 
        <p> Numeri di accessi: ${cnt} </p>
        `);
});

app.listen(3000, () => {
    console.log('server started at http://localhost:3000');
});