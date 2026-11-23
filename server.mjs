import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||4174);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon'};
createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const target=resolve(root,'.'+(pathname==='/'||pathname==='/data-service'?'/index.html':pathname));
  if(target!==root&&!target.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try{const data=await readFile(target);res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream','Cache-Control':'no-store',
    'Content-Security-Policy':"default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data: blob:; font-src 'self' data:; worker-src 'self' blob:;"});res.end(data)}catch{res.writeHead(404);res.end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`PandaAI local preview: http://127.0.0.1:${port}/data-service`));
