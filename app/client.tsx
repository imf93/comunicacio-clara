import React from 'react';import{createRoot}from'react-dom/client';import Studio from './studio';import Vote from './v/[id]/vote';
const id=location.pathname.match(/^\/v\/([^/]+)$/)?.[1];
createRoot(document.getElementById('root')!).render(id?<Vote id={id}/>:<Studio/>);


