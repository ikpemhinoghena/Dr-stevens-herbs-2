import {enabled,importProducts} from './cloud.mjs';
import {products} from './data.mjs';
if(!enabled)throw Error('Configure .env with DATA_BACKEND=supabase first.');
await importProducts(products);
console.log('Existing products imported. Products already present were preserved.');
