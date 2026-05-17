const fs = require('fs');

const path = './src/data/topics.js';
let content = fs.readFileSync(path, 'utf8');

// The file exports `topics` which is an array of objects.
// We can use a regex to carefully remove the `notes: [...]` block from each object.
// Or we can just leave the file alone and ignore `notes` in StudyPage.jsx.

// Wait, doing a regex is dangerous. Let's just do a simple replacement for the specific `notes` fields.
// Since they are formatted with standard indentation, we can match `notes: [\s\S]*?]\n  }` and replace with `}`.
content = content.replace(/,\s*notes:\s*\[[\s\S]*?\]\n  \}/g, '\n  }');
content = content.replace(/,\n\s*notes:\s*\[[\s\S]*?\]\n  \}/g, '\n  }');

fs.writeFileSync(path, content, 'utf8');
console.log("Stripped notes from topics.js");
