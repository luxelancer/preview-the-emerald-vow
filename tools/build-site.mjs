import { build } from 'vite'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const mediaTypes = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.wav':'audio/wav','.woff2':'font/woff2','.txt':'text/plain'}
const root = path.resolve('dist')
async function collectAssets(directory, assets) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'server' && !entry.name.startsWith('.')) await collectAssets(filename,assets)
    } else {
      const key = '/' + path.relative(root,filename).split(path.sep).join('/')
      assets[key] = [mediaTypes[path.extname(filename)] || 'application/octet-stream', (await readFile(filename)).toString('base64')]
    }
  }
}

// Sites runs this self-contained Worker. The same client build also works with the Node server.
await build({
  configFile:false,
  publicDir:false,
  plugins:[{
    name:'invitation-worker-assets',
    resolveId(id){if(id==='virtual:invitation-assets') return '\0'+id},
    async load(id){
      if(id!=='\0virtual:invitation-assets') return
      const assets={}
      await collectAssets(root,assets)
      return 'export default '+JSON.stringify(assets)
    }
  }],
  build:{outDir:'dist/server',emptyOutDir:false,lib:{entry:'server/site.mjs',formats:['es'],fileName:()=>'index.js'},minify:false,reportCompressedSize:false}
})

