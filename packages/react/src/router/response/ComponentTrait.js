const react = require('react');
const Exception = require('../../Exception');

class ComponentTrait {
  /**
   * Returns the component
   *
   * @return {String}
   */
  getComponent() {
    return this.get('component');
  }

  /**
   * Returns true if component is set
   *
   * @return {Boolean}
   */
  hasComponent() {
    return this.has('component');
  }

  /**
   * Sets the component
   *
   * @param {*} component Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  setComponent(component) {
    //if it's not a react element
    if (!react.isValidElement(component)) {
      throw Exception.for('Invalid React Component');
    }

    return this.set('component', component);
  }
}

//adapter
module.exports = ComponentTrait;
