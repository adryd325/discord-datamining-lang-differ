# Discord-Datamining lang differ
### Does what it says it does, It diffs lang files.
(Don't use this please, this is only public for the fact that it's required in a CI somewhere)

Usage:
```
const fs = require('fs');
const differ = require('discord-datamining-lang-differ')
const oldFile = fs.readFileSync(__dirname + '/oldFile.js', 'utf-8') 
const newFile = fs.readFileSync(__dirname + '/newFile.js', 'utf-8')
differ('string1','string2')
```

Returns an easy to read, markdown formatted diff of the changes to lang entries
