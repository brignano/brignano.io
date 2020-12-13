var Gisty = require('gisty');
let theme = require('./jsonresume-theme-stackoverflow/index');

var gist = new Gisty({
  username: 'brignano',
});

export default async (req, res) => {
  let te = '<h1>hello</h1>';
  await gist.fetch('99d784fa160c1d40f29c64a9e36b50a3', async function (error, gist) {
    if (error) {
      throw new Error(error);
    }

    const filename = 'resume.json';
    const fileContent = gist.files[filename].content;
    res.status(200);
    te = await theme.render(JSON.parse(fileContent));
    res.status(200);
    res.send(te);
  });
};
