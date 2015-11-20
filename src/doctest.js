/**
 * @author Denis Vlassenko <denis_vlassenko@epam.com>
 */

  /**
    * Returns new flow emitting the emissions from this flow and then from all provided sources without interleaving them.
    *
    * @category Aggregation
    *
    * @param {...any} [sources] Values to concatenate with this flow.
    *
    * @example
    * aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
    * // next 1
    * // next 2
    * // next 3
    * // next 4
    * // next 5
    * // next 6 // after 500ms
    * // done
    */
  function append(...sources) {
    return aeroflow(this, ...sources);
  }