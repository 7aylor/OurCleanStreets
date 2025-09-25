import app from './app';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`ocs server is listening on port ${port}`);
});
