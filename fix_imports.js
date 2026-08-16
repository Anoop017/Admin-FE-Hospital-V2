const fs = require('fs');
let types = fs.readFileSync('src/types/index.ts', 'utf8');
let exportsArr = [...types.matchAll(/export interface ([A-Za-z0-9_]+)/g)].map(m => m[1]);
let api = fs.readFileSync('src/lib/api.ts', 'utf8');
api = api.replace(/import type \{[\s\S]*?\} from "@\/types";/, 'import type { ' + exportsArr.join(', ') + ' } from "@/types";');
fs.writeFileSync('src/lib/api.ts', api);
console.log('Fixed imports');
