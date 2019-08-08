const queryString = require('querystrings');
const formidable = require('formidable');
const { Registry } = require('@geum/core');

class RequestPost extends Registry {
  /**
   * POST Loader, while injecting the content into the given request
   *
   * @param {IncomingMessage}
   *
   * @return {RequestPost}
   */
  static async load(request) {
    //inject get into the request object
    const registry = request.post = new RequestPost();

    //set the post
    registry.data = await RequestPost.getBody(request);

    return registry;
  }

  /**
   * Get the raw body
   *
   * @param {IncomingMessage}
   *
   * @return {Promise} [{String}]
   */
  static getBody(request) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(request, (error, fields, files) => {
        if (error) {
          return reject(error);
        }

        fields = queryString.stringify(fields);
        fields = queryString.parse(fields);

        resolve(fields)
      });
    });
  }
}

//adapter
module.exports = RequestPost;
