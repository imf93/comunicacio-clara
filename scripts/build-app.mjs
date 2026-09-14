import{build}from'rolldown';import{mkdir,readFile,writeFile,cp}from'node:fs/promises';import path from'node:path';
const root=process.cwd();await mkdir('dist/client',{recursive:true});await mkdir('dist/server',{recursive:true});
await build({input:'app/client.tsx',resolve:{alias:{'@':root}},transform:{jsx:{runtime:'automatic'}},output:{dir:'dist/client',entryFileNames:'app.js',assetFileNames:'[name][extname]',format:'esm',minify:true}});
await build({input:'server/worker.ts',external:['cloudflare:workers','node:async_hooks'],resolve:{alias:{'@':root}},output:{file:'dist/server/index.js',format:'esm',minify:true}});
await build({input:'server/local-entry.ts',external:['node:async_hooks'],resolve:{alias:{'@':root,'cloudflare:workers':path.resolve('server/local-env.ts')}},output:{file:'dist/server/local.js',format:'esm'}});
await writeFile('dist/client/index.html','<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Palabra Viva</title><meta name="description" content="Votaciones con QR y nube de palabras en directo"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');
await cp('app/globals.css','dist/client/app.css');await cp('public/favicon.svg','dist/client/favicon.svg');await cp('public/ajuntament.png','dist/client/ajuntament.png');await cp('public/comunicacio-referencia.png','dist/client/comunicacio-referencia.png');await mkdir('dist/.openai',{recursive:true});await cp('.openai/hosting.json','dist/.openai/hosting.json');await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Aplicación compilada: dist/client y dist/server.');



