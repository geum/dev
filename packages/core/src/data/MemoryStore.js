const Definition = require('../Definition');
const Helper = require('../Helper');

const StoreInterface = require('./contracts/StoreInterface');
const StoreSchema = require('./StoreSchema');
const StoreSearch = require('./StoreSearch');
const DataException = require('./DataException');

class MemoryStore {
  /**
   * Setups the memory store
   */
  constructor() {
    this.collections = {};

    //allows interfaces to be manually changed
    this.schemaInterface = StoreSchema;
    this.searchInterface = StoreSearch;
  }

  /**
   * Store Loader
   *
   * @return {MemoryStore}
   */
  static load() {
    return new MemoryStore();
  }

  /**
   * Inserts data to the store
   *
   * @param {String} collectionName
   * @param {Object} data
   *
   * @return {StoreInterface}
   */
  async insert(collectionName, data) {
    //get the in memory collection
    const collection = this._getCollection(collectionName);
    //get the primary key
    const key = this.getPrimaryKey(collectionName);
    //make a new id
    const id = ++collection.id;
    //make a copy of the data
    const row = Object.assign({}, data);
    //assign the primary key
    row[key] = id;
    //insert into collection
    collection.rows.push(row);
    //get the detail
    let detail = await this.detail(collectionName, key, id);
    //return a separate object
    return Object.assign({}, data, detail);
  }

  /**
   * Retrieves data from the store
   *
   * @param {String} collectionName
   * @param {String} key
   * @param {(String|Integer)} value
   *
   * @return {Object}
   */
  async detail(collectionName, key, value) {
    const results = await this.search(collectionName, [['eq', key, value]]);
    return results.rows[0] || null;
  }

  /**
   * Returns the primary key
   *
   * @param {String} collectionName
   *
   * @return {String}
   */
  getPrimaryKey(collectionName) {
    return collectionName + '_id';
  }

  /**
   * Returns a schema attached to the store
   *
   * @param {String} collectionName
   *
   * @return {StoreSchema}
   */
  makeSchema(collectionName) {
    const schemaInterface = this.schemaInterface;
    return new schemaInterface(collectionName, this);
  }

  /**
   * Searches in the store
   *
   * @param {String} collectionName
   *
   * @return {StoreSearch}
   */
  makeSearch(collectionName) {
    const searchInterface = this.searchInterface;
    const search = new searchInterface(this);
    return search.from(collectionName);
  }

  /**
   * Removes data from the store
   *
   * @param {String} collectionName
   * @param {String} key
   * @param {(String|Integer)} value
   *
   * @return {Object}
   */
  async remove(collectionName, key, value) {
    const detail = await this.detail(collectionName, key, value);

    if (detail) {
      this.collections[collectionName].rows.forEach((row, i) => {
        if (row[key] == value) {
          this.collections[collectionName].rows.splice(i, 1);
        }
      });
    }

    return detail;
  }

  /**
   * Searches in the store
   *
   * @param {String} collectionName
   * @param {*} [filters = []]
   *
   * @return {Array}
   */
  async search(collectionName, filters = []) {
    const results = { rows: [], total: 0 };
    //if no collection by that name
    if (typeof this.collections[collectionName] === 'undefined') {
      //return empty results
      return results;
    }

    //clean the filters
    let [filtered, sort, start, range] = MemoryStore._getFilters(filters);

    this.collections[collectionName].rows.forEach(row => {
      if (MemoryStore._valid(row, filtered)) {
        results.rows.push(row);
        results.total ++;
      }
    });

    //sort
    MemoryStore._sort(results.rows, sort);

    if (!range) {
      range = results.rows.length;
    }

    results.rows = results.rows.slice(start, range);

    return results;
  }

  /**
   * Updates data to the store
   *
   * @param {String} collectionName
   * @param {String} key
   * @param {(String|Integer)} value
   * @param {Object} data
   *
   * @return {Object}
   */
  async update(collectionName, key, value, data) {
    this.collections[collectionName].rows.forEach((row, i) => {
      if (row[key] == value) {
        this.collections[collectionName].rows[i] = Object.assign({}, row, data);
      }
    });

    return await this.detail(collectionName, key, value);
  }

  /**
   * Sort Results
   *
   * @param {Array} rows
   * @param {Object} sort
   */
  static _sort(rows, sort) {
    //sort
    Object.keys(sort).forEach(key => {
      const direction = sort[key];
      rows.sort((a, b) => {
        //what to compare?
        let compare = 'string';
        if (typeof a[key] === 'number' && typeof a[key] === 'number') {
          compare = 'number';
        }

        //if number and ascending
        if (compare === 'number' && direction.toUpperCase() === 'ASC') {
          return a[key] < b[key] ? 1: -1;
        }

        //if number and descending
        if (compare === 'number' && direction.toUpperCase() === 'DESC') {
          return a[key] > b[key] ? 1: -1;
        }

        //if string and ascending
        if (direction.toUpperCase() === 'ASC') {
          return a[key].toString().localeCompare(b[key].toString());
        }

        //if string and descending
        return b[key].toString().localeCompare(a[key].toString());
      });
    });
  }

  /**
   * Checks to see if the value given is valid given the filters
   *
   * @param {*} value
   * @param {Array} filters
   *
   * @return {Boolean}
   */
  static _valid(value, filters) {
      // example filters
      // [
      //     ['eq', 'key', 'val'],
      //     ['lt', 'key', 'val'],
      //     ['null', 'key'],
      //     ['or', [
      //         ['eq', 'key', 'val'],
      //         ['lt', 'key', 'val']
      //     ]]
      // ]
      return Helper.forEach(filters, filter => {
        //clone it
        filter = [].concat(filter);
        const action = filter.shift();
        //if there are keys in this filter
        if (filter.length > 1) {
          //get the first key
          const key = filter.shift();

          //shift the action back in
          filter.unshift(action);

          //if value is not an array
          //or there is no key in the array value
          //or it is not valid
          if (typeof value !== 'object'
            || typeof value[key] === 'undefined'
            || !MemoryStore._valid(value[key], [filter])
          ) {
            return false;
          }

          //continue
          return;
        }

        if (filter.length === 1) {
          //and case
          if (action === 'and' && !MemoryStore._valid(value, filter[0])) {
            return false;
          }

          //or case
          if (action === 'or') {
            let valid = false;
            Helper.forEach(filter[0], subfilter => {
              if (MemoryStore._valid(value, [subfilter])) {
                valid = true;
                //break
                return false;
              }
            });

            if (!valid) {
              return false;
            }
          }

          //reverse switch
          switch (true) {
            case action === 'eq' && !(value == filter[0]):
            case action === 'neq' && !(value != filter[0]):
            case action === 'eqq' && !(value === filter[0]):
            case action === 'neqq' && !(value !== filter[0]):
            case action === 'lt' && !(value < filter[0]):
            case action === 'lte' && !(value <= filter[0]):
            case action === 'gt' && !(value > filter[0]):
            case action === 'gte' && !(value >= filter[0]):
            case action === 'like' && value.indexOf(filter[0]) === -1:
            case action === 'regexp' && !value.match(filter[0]):
            case action === 'key' && typeof value[filter[0]] === 'undefined':
            case action === 'contains' && !(
              value instanceof Array
              && value.indexOf(filter[0]) !== -1
            ):
              return false;
          }
        }

        //filter count is zero
        switch (true) {
            case action === 'nem' && !value.length:
            case action === 'num' && typeof value !== 'number':
            case action === 'int' && (
              typeof value !== 'number'
              || value.toString().indexOf('.') !== -1
            ):
            case action === 'float' && (
              typeof value !== 'number'
              || value.toString().indexOf('.') === -1
            ):
            case action === 'string' && typeof value !== 'string':
            case action === 'array' && !(value instanceof Array):
                return false;
        }
      });
  }

  /**
   * Normalizes the filter input
   *
   * @private
   *
   * @param {Array} filters
   *
   * @return {Array}
   */
  static _getFilters(filters) {
    let sort = {},
      start = 0,
      range = null;

    // example filters
    // [
    //   ['eq', 'key', 'val'],
    //   ['lt', 'key', 'val'],
    //   ['null', 'key'],
    //   ['or', [
    //     ['eq', 'key', 'val'],
    //     ['lt', 'key', 'val']
    //   ]]
    // ]
    const sortOptions = ['asc', 'desc'];

    filters.forEach((filter, i) => {
      // 'key = value'
      if (typeof filter === 'string') {
        return;
      }

      if (!(filter instanceof Array) || !filter.length) {
        delete filters[i];
        return;
      }

      if (filter[0] === 'sort') {
        if (typeof filter[2] !== 'undefined') {
          sort[filter[1]] = filter[2].toLowerCase()
        }

        delete filters[i];
        return;
      }

      if (filter[0] === 'start') {
        if (
          typeof filter[1] !== 'undefined'
          && !isNaN(parseInt(filter[1]))
        ) {
          start = filter[1];
        }

        delete filters[i];
        return;
      }

      if (filter[0] === 'range') {
        if (
          typeof filter[1] !== 'undefined'
          && !isNaN(parseInt(filter[1]))
        ) {
          range = filter[1];
        }

        delete filters[i];
        return;
      }
    });

    filters = filters.filter(value => {
      return value;
    });

    return [
      filters,
      sort,
      start,
      range
    ];
  }

  /**
   * Constructs an in memory collection object
   * if it doesn't exist already
   *
   * @param {String} collectionName
   */
  _getCollection(collectionName) {
    if (typeof this.collections[collectionName] === 'undefined') {
      this.collections[collectionName] = { id: 0, rows: [] };
    }

    return this.collections[collectionName];
  }
}

//definition check
Definition(MemoryStore).implements(StoreInterface);

//adapter
module.exports = MemoryStore;
