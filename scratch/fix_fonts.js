const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const weightMap = {
        '400': 'Regular',
        'normal': 'Regular',
        '500': 'Medium',
        '600': 'SemiBold',
        '700': 'Bold',
        '800': 'Bold',
        'bold': 'Bold'
      };
      
      let changed = false;
      
      content = content.replace(/fontFamily:\s*'([^']+)'\s*,\s*fontWeight:\s*'([^']+)'/g, (match, font, weight) => {
        const weightName = weightMap[weight];
        if (weightName && (font === 'SpaceGrotesk' || font === 'IBMPlexSans' || font === 'IBMPlexMono')) {
            changed = true;
            return `fontFamily: '${font}-${weightName}'`;
        }
        return match;
      });
      
      content = content.replace(/fontWeight:\s*'([^']+)'\s*,\s*fontFamily:\s*'([^']+)'/g, (match, weight, font) => {
        const weightName = weightMap[weight];
        if (weightName && (font === 'SpaceGrotesk' || font === 'IBMPlexSans' || font === 'IBMPlexMono')) {
            changed = true;
            return `fontFamily: '${font}-${weightName}'`;
        }
        return match;
      });

      if (changed) {
        console.log('Updated: ' + fullPath);
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('c:/gravity/agrisync/src');
