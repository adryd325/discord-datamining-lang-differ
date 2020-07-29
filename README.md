# Discord-Datamining lang differ
### Does what it says it does, It diffs lang files.
(for your own sake, don't use this, this is only public for the fact that it's required in a CI somewhere)

Install
```sh
npm install --save https://github.com/adryd325/discordDataminingLangDiffer.git
```

Example
```js
const fs = require('fs');
const differ = require('@adryd325/discord-datamining-lang-differ')
const oldFile = fs.readFileSync(__dirname + '/oldFile.js', 'utf-8')
const newFile = fs.readFileSync(__dirname + '/newFile.js', 'utf-8')
console.log(differ(oldFile,newFile))
```

Returns an easy to read, markdown formatted diff of the changes to lang entries

