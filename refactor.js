const fs = require('fs');
const path = require('path');

const replacements = [
  { match: /groupSlug/g, replace: 'stakeSlug' },
  { match: /group_id/g, replace: 'stake_id' },
  { match: /ward_id/g, replace: 'entity_id' },
  { match: /\.from\('groups'\)/g, replace: ".from('stakes')" },
  { match: /\.from\('wards'\)/g, replace: ".from('entities')" },
  { match: /group\./g, replace: 'stake.' },
  { match: /data: group/g, replace: 'data: stake' },
  { match: /const group /g, replace: 'const stake ' },
  { match: /setGroup\(/g, replace: 'setStake(' },
  { match: /ward\./g, replace: 'entity.' },
  { match: /data: wards/g, replace: 'data: entities' },
  { match: /const wards /g, replace: 'const entities ' },
  { match: /const ward /g, replace: 'const entity ' },
  { match: /setWards/g, replace: 'setEntities' },
  { match: /group =>/g, replace: 'stake =>' },
  { match: /ward =>/g, replace: 'entity =>' },
  { match: /groupId/g, replace: 'stakeId' },
  { match: /group:/g, replace: 'stake:' },
  { match: /groups:/g, replace: 'stakes:' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      for (const { match, replace } of replacements) {
        newContent = newContent.replace(match, replace);
      }
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done!');
