
It's just a sandbox yet, not ready for production use.

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
- Realtime updates
- Multiple front-end applications can run on top of single back-end
- Everything is compiled in development mode, I want production server to be up as fast as possible, so the only bottleneck is the babel so far.
- .es6 extension is used for es2015 files
- .jsx extension is used for react templates
- Everything the client need is bundled into a single file
- BEM naming pattern for components
