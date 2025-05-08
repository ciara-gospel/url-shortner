import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "Simple API to shorten and manage URLs",
    },
    servers: [
      {
        url: "http://localhost:3500",
      },
    ],
  },
  apis: ["./routes/*.js"], // ajuster selon ta structure
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
