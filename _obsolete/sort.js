/*
/*
  aeroflow([4, 2, 5, 3, 1]).sort().dump().run();
* /
sort(order, ...comparers) {
  return sort(this, order, ...comparers);
}

function sort(flow, order, ...selectors) {
  if (isFunction(order)) {
    selectors.unshift(order);
    order = 1;
  }
  if(!selectors.every(isFunction)) throwError('Selector function expected.');
  switch (order) {
    case 'asc': case 1: case undefined: case null:
      order = 1;
      break;
    case 'desc': case -1:
      order = -1;
      break;
    default:
      order = order ? 1 : -1;
      break;
  }
  switch(selectors.length) {
    case 0: return sortStandard(flow, order);
    case 1: return sortWithSelector(flow, order, selectors[0]);
    default: return sortWithSelectors(flow, order, ...selectors);
  }
}
function sortStandard(flow, order) {
  let array = toArray(flow);
  return new Aeroflow((next, done, context) =>
    array[SYMBOL_EMITTER](
      values => order === 1
        ? values.sort().forEach(next)
        : values.sort().reverse().forEach(next)
      , done
      , context));
}
function sortWithSelector(flow, order, selector) {
  let array = toArray(flow)
    , comparer = (left, right) => order * compare(selector(left), selector(right));
  return new Aeroflow((next, done, context) => array[SYMBOL_EMITTER](
    values => values.sort(comparer).forEach(next)
  , done
  , context));
}
function sortWithSelectors(flow, order, ...selectors) {
  let array = toArray(flow)
    , count = selectors.length
    , comparer = (left, right) => {
        let index = -1;
        while (++index < count) {
          let selector = selectors[index]
            , result = order * compare(selector(left), selector(right));
          if (result) return result;
        }
        return 0;
      };
  return new Aeroflow((next, done, context) => 
    array[SYMBOL_EMITTER](
      values => values.sort(comparer).forEach(next)
    , done
    , context));
}
*/