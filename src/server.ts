import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();
  // Set the network port
  const port = process.env.PORT || 8080;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get(
    "/filteredimage",
    async (req: express.Request, res: express.Response) => {
      let image_url = req.query.image_url;
      //Validate url
      const isValidImageUrl = /\.(jpg|jpeg)$/.test(image_url);
      if (!isValidImageUrl) {
        return res.status(400).send(`Inavlid url! Try again with valid url`);
      } else {
        const filePath = await filterImageFromURL(image_url);
        res.sendFile(
          filePath,
          {
            headers: {
              "Content-Type": "image/jpg", // Change 'application/octet-stream' to the appropriate MIME type
            },
          },
          function (err) {
            if (err) {
              console.error("Error sending file:", err);
            } else {
              deleteLocalFiles([filePath]);
            }
          }
        );
      }
    }
  );

  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
