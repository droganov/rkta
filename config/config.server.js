var defaults = {
   PORT: 3000,
   MONGO_URL: "mongodb://localhost:27017/rkta",
   REDIS_URL: "redis://localhost:6379",
   SESSION_KEYS: "+*C0C80G3]p'#BFg91&iOw6h~.86#2,RA1lB|92RE4jr>{ePu3xZ9@h_N_.v?",
}

for( var key in defaults ) {
   process.env[key] = process.env[key] || defaults[key];
}

module.exports = process.env;
