## Usage
Start Dev Server:
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

Create new application:
```
> npm run create --app=name
```

Debug:
```
> npm run debug
```

## Features
- Isomorphism
- Racer.js
  - Realtime subscriptions
  - Automatic model creation
  - Conflict resolution via Operational Transformation
  - Offline (OT)
  - Universal interface (client/server)
  - Persistent storage (MongoDB + abstract ShareDB interface)
  - ~~Access control~~
  - ~~Schemas~~
  - ~~RPC~~
- Multiple front-end applications via koa mount
- Hot Module Replacement (react-hmre)
- Css Modules
- Styles config is shared between stylus and react
- Redux + react-router-redux => application state handling
- Precompiled production bundles => no transform in production => instant start
- ~~GrapQL backend~~ as a facade


## Conventions
- .es6 is for es2015 files
- .jsx is for react templates
- .js — when you don't need babel transform
