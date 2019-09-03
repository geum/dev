const { Reflection, Response: CoreResponse } = require('@geum/core');

const CookieTrait = require('./response/CookieTrait');
const PageTrait = require('./response/PageTrait');
const TargetTrait = require('./response/TargetTrait');

class Response extends CoreResponse {
  /**
   * Response Loader
   *
   * @param {Object} data
   *
   * @return {Response}
   */
  static load(data = {}) {
    return new Response(data);
  }

  /**
   * Redirects out to the given path
   *
   * @param {String} path
   * @param {Integer} [code = 302]
   * @param {Boolean} [emulate = false]
   *
   * @param {Boolean}
   */
  redirect(path, code = 302, emulate = false) {
    this.setHeader('Location', path);
    this.set('code', code);
    this.setContent('Redirecting...');
    return emulate;
  }
}

//definition check
Reflection(Response).uses(CookieTrait, PageTrait, TargetTrait);

//adapter
module.exports = Response;
