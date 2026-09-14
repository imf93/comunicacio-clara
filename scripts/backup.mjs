import{DatabaseSync,backup}from'node:sqlite';import{mkdirSync}from'node:fs';import{resolve}from'node:path';
const source=resolve(process.env.DATA_DIR||'.local','votes.sqlite');mkdirSync('backups',{recursive:true});const db=new DatabaseSync(source,{readOnly:true});const destination=resolve('backups','palabra-viva-'+new Date().toISOString().replaceAll(':','-')+'.sqlite');await backup(db,destination);db.close();console.log(destination);

