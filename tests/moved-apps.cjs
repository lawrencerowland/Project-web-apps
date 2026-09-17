const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),routes=JSON.parse(fs.readFileSync(path.join(root,'moved-apps.json'),'utf8'));
const csv=fs.readFileSync(path.join(root,'app-index.csv'),'utf8');
for(const route of routes){
  const file=path.join(root,route.old_path),html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes('rel="canonical" href="'+route.destination+'"'));
  assert.ok(!csv.split(/\r?\n/).some(line=>line.split(',')[1]===route.name),'moved app remains in general catalogue');
  assert.ok(html.length<2200,'old implementation retained');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const [search,hash]of [['',''],['?view=details&value=two%20words','#section-2']]){
    const anchor={href:route.destination};let replaced;
    vm.runInNewContext(script,{URL,document:{getElementById:id=>{assert.equal(id,'destination');return anchor;}},location:{search,hash,replace:url=>replaced=url}});
    assert.equal(replaced,route.destination+search+hash);assert.equal(anchor.href,replaced);
  }
  if(route.old_path.startsWith('apps/'))assert.deepEqual(fs.readdirSync(path.dirname(file)),['index.html'],'working source survives redirect');
}
console.log('PASS: '+routes.length+' canonical redirects preserve query/fragment; gallery retirement and no duplicate implementations.');
