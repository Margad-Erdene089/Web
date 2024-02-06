global.apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/v1"
    : process.env.NEXT_PUBLIC_API_URL;
global.version = "v0.01";
