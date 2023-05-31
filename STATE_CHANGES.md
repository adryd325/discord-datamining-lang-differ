# package.json

```diff
- "name": "@adryd325/discord-datamining-lang-differ",
+ "name": "@xhyrom-forks/discord-datamining-lang-differ",
```

# .gitignore

```diff
+ test-files/
```

# testGetLangStrings.js

```diff
- const getLangStrings = require("./getLangStrings.js")
+ const getLangStrings = require("./getLangStrings.js");
const fs = require("fs");
- console.log(getLangStrings(fs.readFileSync(process.argv[2])))
+ console.log(getLangStrings(fs.readFileSync(process.argv[2])));
```

# testGetLangEndpoints.js

```diff
+ const getLangEndpoints = require("./getLangEndpoints.js");
+ const fs = require("fs");
+ console.log(getLangEndpoints(fs.readFileSync(process.argv[2])));
```

# getLangEndpoints.js

- new file
