import app from './app';

const port = process.env.PORT || 5000;

if (!process.env.OCS_DB) {
  throw new Error('OCS_DB must be set in environment variables');
}

if (!process.env.OSR_API) {
  throw new Error('OSR_API must be set in environment variables');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in environment variables');
}

app.listen(port, () => {
  console.log(`ocs server is listening on port ${port}`);
});
