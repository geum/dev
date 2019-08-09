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

        //clone
        fields = Object.assign(fields);
        files = Object.assign(files);

        const body = Registry.load();

        Object.keys(fields).forEach(name => {
          //change path to dot notation
          let path = name
            .replace(/\]\[/g, '.')
            .replace('[', '.')
            .replace(/\[/g, '')
            .replace(/\]/g, '');

          //if the field value is not an array
          if (!Array.isArray(fields[name])) {
            //make it an array
            fields[name] = [fields[name]];
          }

          //now loop through each value
          fields[name].forEach(value => {
            //and set the value
            body.setDot(path, value);
          });
        });

        Object.keys(files).forEach(name => {
          //change path to dot notation
          let path = name
            .replace(/\]\[/g, '.')
            .replace('[', '.')
            .replace(/\[/g, '')
            .replace(/\]/g, '');

          //if the field value is not an array
          if (!Array.isArray(files[name])) {
            //make it an array
            files[name] = [files[name]];
          }

          //now loop through each value
          files[name].forEach(value => {
            //and set the value
            body.setDot(path, value);
          });
        });

        resolve(body.get());
      });
    });
  }
}

//adapter
module.exports = RequestPost;
