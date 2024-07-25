const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;

  // Map URL paths to file paths in the public directory
  let publicFilePath = path.join(__dirname, "public", pathname);

  // Serve index.html by default if URL ends with '/'
  if (publicFilePath.endsWith("/")) {
    publicFilePath = path.join(publicFilePath, "index.html");
  }

  // Determine file extension
  let extname = path.extname(publicFilePath);
  let contentType = "text/html";

  // Set content type based on file extension
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".ico":
      contentType = "image/x-icon";
      break;
  }

  // Check if file exists in the public directory
  fs.readFile(publicFilePath, (publicErr, publicContent) => {
    if (!publicErr) {
      // Serve the file from the public directory
      res.writeHead(200, { "Content-Type": contentType });
      res.end(publicContent, "utf-8");
    } else {
      // Map URL paths to file paths in the node_modules directory
      let nodeModulesFilePath = path.join(__dirname, "node_modules", pathname);

      // Check if file exists in the node_modules directory
      fs.readFile(nodeModulesFilePath, (nodeModulesErr, nodeModulesContent) => {
        if (!nodeModulesErr) {
          // Serve the file from the node_modules directory
          res.writeHead(200, { "Content-Type": contentType });
          res.end(nodeModulesContent, "utf-8");
        } else {
          // Serve the file by pathname
          fs.readFile(pathname.slice(1), (err, content) => {
            if (err) {
              // File not found, return 404
              res.writeHead(404);
              res.end("404 Not Found");
            } else {
              // Serve the file with appropriate content type
              res.writeHead(200, { "Content-Type": contentType });
              res.end(content, "utf-8");
            }
          });
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
