const fs = require('fs');
const path = require('path');

const environmentFilePath = path.join(
  __dirname,
  '../../src/environments/environment.ts',
);
const environmentTemplateFilePath = path.join(
  __dirname,
  '../../src/environments/environment.ts',
);

fs.readFile(environmentTemplateFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the template file', err);
    process.exit(1);
  }

  const result = data
    .replace('{{FIREBASE_API_KEY}}', process.env.FIREBASE_API_KEY)
    .replace('{{FIREBASE_AUTH_DOMAIN}}', process.env.FIREBASE_AUTH_DOMAIN)
    .replace('{{FIREBASE_PROJECT_ID}}', process.env.FIREBASE_PROJECT_ID)
    .replace('{{FIREBASE_STORAGE_BUCKET}}', process.env.FIREBASE_STORAGE_BUCKET)
    .replace(
      '{{FIREBASE_MESSAGING_SENDER_ID}}',
      process.env.FIREBASE_MESSAGING_SENDER_ID,
    )
    .replace('{{FIREBASE_APP_ID}}', process.env.FIREBASE_APP_ID)
    .replace(
      '{{FIREBASE_MEASUREMENT_ID}}',
      process.env.FIREBASE_MEASUREMENT_ID,
    );

  fs.writeFile(environmentFilePath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the environment file', err);
      process.exit(1);
    }
  });
});
