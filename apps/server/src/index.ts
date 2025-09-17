import express from 'express';
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get-route', (req, res) => {
  res.send('Pretend this is mapping route data');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
