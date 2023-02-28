const fs = require("fs");
const http = require("http");
// const path = require("path");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");
////////////////////////////////////////////
//Files
//Bloking synchronous way
/*const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what i know about avocado: ${textIn}.\nCreated on ${Date()}`;
fs.writeFileSync("./txt/output.txt", textOut); */

//Non-blocking async way
/* fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("Error! ⚡");

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);

    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been writen✍");
      });
    });
  });
});
console.log("Will read file!"); */
////////////////////////////////////////////
//Server

const devdata = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(devdata);

const dataObjSlugs = dataObj.map((el) => {
  return (el.slug = slugify(el.productName, { lower: true }));
});

console.log(dataObj);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);
  console.log(pathname);
  console.log(query);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    response.end(output);

    //Product Page
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    response.end(output);

    //API
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(devdata);

    //Not Found
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello",
    });
    response.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
