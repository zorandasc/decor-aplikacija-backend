const allowedOrigins = [
  "https://decor-aplikacija.onrender.com",
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
