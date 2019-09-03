const React = require('react');
const Exception = require('./Exception');

class ComponentTrait {
  /**
   * @var {Component} component
   */
  set component(component) {
    this.setComponent(component);
  }

  /**
   * Returns true if the component is a React Component
   *
   * @return {Boolean}
   */
  isReactComponent() {
    const content = this.getContent();
    return typeof content === 'function' && (
      !!content.prototype.isReactComponent
      || String(content).includes('return React.createElement')
    );
  }

  /**
   * Returns true if the component is a React Element
   *
   * @return {Boolean}
   */
  isReactElement() {
    return React.isValidElement(this.getContent());
  }

  /**
   * Sets the component
   *
   * @param {*} component Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  setComponent(component) {
    this.set('body', component);

    //if it's not a react element
    if (!this.isReactComponent() && !this.isReactElement()) {
      throw Exception.for('Invalid React Component/Element');
    }

    return this;
  }
}

//adapter
module.exports = ComponentTrait;
