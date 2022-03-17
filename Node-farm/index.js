const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

////////////////////FILES

// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

// const textO = `This is what we know about the avocado: ${text}`;

// fs.writeFileSync("./txt/output.txt", textO);

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file has been written");
//       });
//     });
//   });
// });

//////////// ///////////////
/////////SERVER////////////
//////////////////////////

const templateOverview = fs.readFileSync('./templates/overview.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/product.html', 'utf-8');
const templateCard = fs.readFileSync('./templates/card.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');

    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);
    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello World',
    });
    res.end(`<h1>"PAGE Not found!"</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
