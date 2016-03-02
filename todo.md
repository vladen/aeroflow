# todo:
Thoughts:
  * context creates an ambiguity in shared execution (cache, share) and prone to side-effects
  * bind should be re-thinked as only-once operation (special type of flow)
  * dump is nothing more than special type of notifier
  * next and done notifications may accept additional argument with flags of operators already applied to the flow (e.g. cache operator), it could help eliminate exceptional work and plan the execution better (subqueries)
  * take(@condition:promise) takes values until promise resolves or rejects
  * skip(@condition:promise) skips values until promise resolves or rejects
  * cache(@expiration:promise) expires when promise resolves or rejects
Operators:
  * buffer(count)
  * zip(thatFlow)
  * scan(scanner, seed)
  * window(interval)
  * debounce(interval, mode)
  * throttle(interval)
  * at(index)
  * fork(selector, leftCallback, rightCallback)
  * merge(thatFlow)
  * after(interval/condition)
  * pause/resume
  * amb
  * avg
  * ranges (compute min and max, split the range into number of subranges)
