const allowedOrigins = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
  "http://localhost:3000",
];

const corsOptions = {
  credentials: true, //sett Access-Control-Allow-Credentials header
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); //awerything ok
    } else {
      callback(new Error("Not allowed by CORS :(."));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
