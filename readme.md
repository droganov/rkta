# Readme
Start Dev Server:
```
> gulp

```

Start Production Server:
```
> npm start
```


## Principles
- Isomorphism
- Multiple front-end applications can run on top of single back-end
- Everything is compiled in development mode, I want production server to be up as fast as possible, so the only bottleneck is the babel so far.
- .es6 extension is used for es2015 files
- .jsx extension is used for react templates
- Everything the client need is bundled into a single file
- BEM naming pattern for components
- .jsx extension for react templates, .es6 for ES6 scripts, .js for ES5
