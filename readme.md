## Usage
Start Dev Server (ensure mongodb is running):
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
* [x] Isomorphism
* [ ] Racer.js integration
  - [x] Realtime subscriptions
  - [x] Automatic model creation
  - [x] Conflict resolution via Operational Transformation
  - [x] Offline (OT)
  - [x] Universal interface (client/server)
  - [x] Persistent storage (MongoDB + abstract ShareDB interface)
  - [ ] Access control
  - [ ] Schemas
  - [ ] RPC
- [x] Multiple front-end applications via koa mount
- [x] Hot Module Replacement (react-hmre)
- [x] Css Modules
- [x] Styles config is shared between stylus and react
- [x] Redux + react-router-redux => application state handling
- [x] Precompiled production bundles => no transform in production => instant start
- [ ] GrapQL backend as a facade


## Conventions
- .es6 is for es2015 files
- .jsx is for react templates
- .js — when you don't need babel transform
