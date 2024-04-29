const Koa = require('koa');
const http = require('http');
const app = new Koa();

app.use(async (ctx) => {
  const { path, querystring } = ctx.request;
  if(path.startsWith('/tmdb')) {
    const truthPath = path.replace('/tmdb', '');
    const options = {
      method: 'GET',
      hostname: 'api.themoviedb.org',
      port: null,
      path: `/3${truthPath}?api_key=${process.env.TMDB_API_KEY}&${querystring}`,
      headers: {
        accept: 'application/json',
      }
    };
  
    const proxyReq = http.request(options);
    ctx.body = await new Promise((resolve, reject) => {
      proxyReq.on('response', (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });
        proxyRes.on('end', () => {
          resolve(data);
        });
      });
  
      proxyReq.on('error', (err) => {
        reject(err);
      });
  
      proxyReq.end();
    })
  }else {
    ctx.body = 'Hello Relay Server!';
  }
});

// 啟動服務器
const server = http.createServer(app.callback());
server.listen(3000);
