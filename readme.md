**The ultimate resource for tooling future web applications.**

```
> git clone https://github.com/droganov/rkta.git
> cd rkta
> npm install
> npm start
```

Start Production Server:
```
> npm run build
> npm run production
```
## Features
- Isomorphism
- Racer.js
  - Realtime subscriptions
  - Automatic model creation
  - Conflict resolution via Operational Transformation
  - Offline
  - Universal interface (client/server)
  - Persistent storage (MongoDB + abstract ShareDB interface)
  - ~~Access control~~
  - ~~Schames~~
  - ~~RPC~~
- Multiple front-end applications via koa mount
- Hot Module Replacement (react-hmre)
- ~~Redux~~ for handling application state
- Precompiled production bundles — no transform in production => minimal possible start delay
- ~~GrapQL backend~~ as a facade


## Conventions
- .es6 extension is used for es2015 files
- .jsx extension is used for react templates
- BEM naming pattern for components
