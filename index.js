const CGMD = require('codegrid-markdown');
const cgmd = new CGMD();
const ipc = require('electron').ipcRenderer;
const path = require('path');
const iframe = document.querySelector('iframe');

ipc.on('open-markdown', (e, arg) => {
  const dirname = path.dirname(arg.path);
  setCurrentFilePath(arg.path);
  arg.md = arg.md.replace(/\.\//, dirname + '/');
  const article = cgmd.render(arg.md);
  updatePreview(article);
});

function updatePreview(article) {
  const html = `
      <html>
      <head>
        <link rel="stylesheet" href="http://ui.codegrid.net/assets2/css/codegrid-ui.min.css">
      </head>
      <body>
        <div class="CG2-narrowLayout">
          <div class="CG2-narrowLayout__main">
            <article class="CG2-article">
              ${article}
            </article>
          </div>
        </div>
        <script src="http://ui.codegrid.net/assets2/js/codegrid-ui.min.js"><\/script>
      </body>
      </html>
      `;

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();
}

function setCurrentFilePath(filePath) {
  window.localStorage.setItem('CGMD-Preview', filePath);
}

function getPrevFilePath() {
  return window.localStorage.getItem('CGMD-Preview');
}

const prevPath = getPrevFilePath();
if (prevPath) {
  ipc.send('display-prev', prevPath);
}