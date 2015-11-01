# Modules

@source http://blogs.msdn.com/b/typescript/archive/2015/07/20/announcing-typescript-1-5.aspx

There has been quite a bit of work on how modules work in the 1.5 release.
With this release, we’ve begun supporting the official ES6 modules,
we’re simplifying how modules work, and we’re adding support for more kinds of modules as output.

## ES6 modules

TypeScript 1.5 supports the new module syntax from ES6.
The ES6 module syntax offers a rich way of working with modules.
Similar to external modules in TypeScript, ES6 modules can import modules and
exports each piece of your public API.
Additionally, ES6 modules allow you to selectively import the parts of that public API you want to use.

```javascript
import * as Math from "my/math";
import { add, subtract } from "my/math";
```

You can also work with the module itself using a ‘default’ export. 
The default allows you a handle on what the module main content is.  
This gives you even more precise control over the API you make available.

```javascript
// math.ts

export function add(x, y) { return x + y }
export function subtract(x, y) { return x – y }
export default function multiply(x, y) { return x * y }
```

```javascript
// myFile.ts

import {add, subtract} from "math";
import times from "math";
var result = times(add(2, 3), subtract(5, 3));
```

If you look closely, you can see the 'export default' used as the last line of math.ts.
This line allows us to control a 'default' export, which is what is exported when you don't
import specific exports with curly braces ({ }) but instead use a name, like the second line of myFiles.ts.


## Simplifying modules

One of the common points of feedback we’ve heard as new users pick up TypeScript
for the first time is that the modules are a bit confusing.
Before ES6, there were internal and external modules.
Now with support for ES6 modules, there is now another module to learn about.
We’re simplifying this with the 1.5 release.

Going forward, internal modules will be called ‘namespace’.
We chose to use this term because of the closeness between how this form
works and namespaces in other languages, and how the pattern in JS, sometimes called IIFE,
is used in practice. We’ve already updated the handbook to reflect this change.
We’re encouraging teams to use the new terminology and corresponding syntax.

Likewise, external modules just become ‘modules’, with a strong emphasis on the standard ES6 module syntax.
With these changes, there is now just one ‘module’, and it works like the corresponding concept in JavaScript.

## New module output

TypeScript has supported multiple module loaders since the early days.
Because JavaScript is used in both the browser and on the server, TypeScript
has supported compiling modules for either AMD or CommonJS.

We’re adding two new module output formats to help continue support more JavaScript
practices: SystemJS and UMD.  SystemJS will allow you to use ES6 modules closer
to their native semantics without requiring an ES6-compatible browser engine.
UMD gives you a way to output a single module that works in both AMD and CommonJS.
