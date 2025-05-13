const { hostname } = require('os');
const https = require('https');
const fs = require('fs');
const path = require('path');

const STACK_NAME = process.env.STACK_NAME || "Unknown Stack";
const httpsPort = 8443;
const httpsKey = '../keys/key.pem';
const httpsCert = '../keys/cert.pem';
const indexPath = path.join(__dirname, 'index.html'); // Path to your index.html file

if (fs.existsSync(httpsKey) && fs.existsSync(httpsCert)) {
  console.log('Starting https server');

  const options = { key: fs.readFileSync(httpsKey), cert: fs.readFileSync(httpsCert) };

  const server = https.createServer(options, (req, res) => {
    // Handle root route for the HTML UI page
    if (req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error loading index.html');
        } else {
          res.end(data); // Serve the index.html content
        }
      });
    }
    // Handle API requests
    else if (req.url === '/api') {
      const apiResponse = {
        message: 'This is a static API response',
        status: 'success',
        data: {
          example: 'value'
        }
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(apiResponse)); // Serve the API response as JSON
    } else {
      res.statusCode = 404;
      res.end('Page not found');
    }
  });

  server.listen(httpsPort, hostname, () => {
    console.log(`Server running at https://${hostname}:${httpsPort}/`);
  });
} else {
  console.log('Could not find certificate/key');
}

