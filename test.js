const fs = require('fs');
try {
  fs.accessSync('index.html', fs.constants.F_OK);
  console.log('index.html exists');
} catch (err) {
  console.error('index.html missing');
  process.exit(1);
}
