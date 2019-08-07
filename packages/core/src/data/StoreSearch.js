const Definition = require('../Definition');

const StoreInterface = require('./contracts/StoreInterface');
const DataException = require('./DataException');

class StoreSearch {
  /**
   * Variable list
   *
   * @param {StoreInterface} store
   */
  constructor(store) {
    if (!Definition(store).instanceOf(StoreInterface)) {
      throw DataException.forInvalidArgument(0, StoreInterface, store);
    }

    this.store = store;

    this.collectionName = null;

    this.filters = [];
    this.sort = {};

    this.start = 0;
    this.range = null;
  }

  /**
   * The initial table to search from
   *
   * @param {String} table
   *
   * @return {SqlSearch}
   */
  from(collectionName) {
    this.collectionName = collectionName;
    return this;
  }

  /**
   * Returns the results based on the search criteria
   *
   * @return {Object}
   */
  async getResults() {
    //consoladate the filters
    let filters = [].concat(this.filters);

    if (this.start) {
      filters.push(['start', this.start]);
    }

    if (this.range) {
      filters.push(['range', this.range]);
    }

    Object.keys(this.sort).forEach(key => {
      filters.push(['sort', key, this.sort[key]]);
    });

    //perform the search
    return this.store.search(this.collectionName, filters);
  }

  /**
   * Returns the first row found
   *
   * @return {(Object|Null)}
   */
  async getRow() {
    let results = await this.getResults();
    return results.rows[0] || null;
  }

  /**
   * Returns the rows based on the search criteria
   *
   * @return {Array}
   */
  async getRows() {
    let results = await this.getResults();
    return results.rows;
  }

  /**
   * Returns the number of rows found
   *
   * @return {Integer}
   */
  async getTotal() {
    let results = await this.getResults();
    return results.total;
  }

  /**
   * Limit clause
   *
   * @param {Integer} start
   * @param {Integer} range
   *
   * @return {SqlSearch}
   */
  limit(start, range) {
    this.start = start;
    this.range = range;

    return this;
  }

  /**
   * Sort by clause
   *
   * @param {String} column
   * @param {String} [order='ASC']
   *
   * @return SqlSearch
   */
  sortBy(column, order = 'ASC') {
    if (order !== 'DESC') {
      order = 'ASC';
    }

    this.sort[column] = order;
    return this;
  }

  /**
   * Where clause
   *
   * @param {(...String)} args
   *
   * @return SqlSearch
   */
  where(...args) {
    this.filters.push(args);
    return this;
  }
}

//adapter
module.exports = StoreSearch;
