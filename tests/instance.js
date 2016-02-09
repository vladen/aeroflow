'use strict';

export default (aeroflow, assert) => describe('Aeroflow', () => {
    describe('#max()', ()=> {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.max));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().max(), 'Aeroflow'));

        it('emitting undefined if empty flow', (done) => {
            let invoked = false;
            aeroflow().max()
                    .run(value => invoked = true);

            setImmediate(() => done(assert.isFalse(invoked)));
        });

        it('emitting valid result for non-empty flow', (done) => {
            let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                , expected = Math.max(...values)
                , actual;

            aeroflow(values).max()
                    .run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });

     describe('#min()', ()=> {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.min));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().min(), 'Aeroflow'));

        it('does not invoke if empty flow', (done) => {
            let invoked = false;
            aeroflow.empty.min()
                    .run(value => invoked = true);

            setImmediate(() => done(assert.isFalse(invoked)));
        });

        it('emitting valid result for non-empty flow', (done) => {
            let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                , expected = Math.min(...values)
                , actual;

            aeroflow(values).min()
                    .run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });

    describe('#skip()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.skip));

        it('emitting undefined if called without param', (done) => {
            let invoked = false;
            aeroflow([1, 2, 3, 4]).skip()
                    .run(value => invoked = true);

            setImmediate(() => done(assert.isFalse(invoked)));
        });
    });

    describe('#skip(@Number)', () => {
        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().skip(1), 'Aeroflow'));

        it('skips provided number of values from start', (done) => {
            let values = [1, 2, 3, 4],
                skip = 2,
                actual = [];

            aeroflow(values).skip(skip)
                .run(value => actual.push(value));

            setImmediate(() => done(assert.sameMembers(actual, values.slice(skip))));
        });

        it('emitting values skipped provided number of values from end', (done) => {
            let values = [1, 2, 3, 4]
                , skip = 2
                , actual = [];

            aeroflow(values).skip(-skip)
                            .run(value => actual.push(value));

            setImmediate(() => done(assert.sameMembers(actual, values.slice(0, skip))));
        });
    });

    describe('#skip(@Function)', () => {
        it('emitting remained values when provided function returns false', (done) => {
            let values = [1, 2, 3, 4]
                , skip = Math.floor(values.length / 2)
                , limiter = (value, index) => index < skip
                , actual = [];

            aeroflow(values).skip(limiter)
                            .run(value => actual.push(value));

            setImmediate(() => done(assert.sameMembers(actual, values.slice(skip))));
        });
    });

    describe('#tap()', () => {
         it('is instance method', () =>
            assert.isFunction(aeroflow.empty.tap));

         it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().tap(), 'Aeroflow'));
    });

    describe('#tap(@Function)', () => {
        it('intercepts each emitted value', done => {
            let expected = [0, 1, 2]
                , actual = [];

            aeroflow(expected).tap(value => actual.push(value)).run();

            setImmediate(() => {
                actual.forEach((item, i) => assert.strictEqual(item, expected[i]));
                done();
            });
        });
    });

    describe('#toArray()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.toArray));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().toArray(), 'Aeroflow'));

        it('emitting empty Array if empty flow', (done) => {
            let actual;

            aeroflow().toArray().run(value => actual = value);

            setImmediate(() => {
                assert.isArray(actual);
                assert.strictEqual(actual.length, 0);
                done();
            });
        });

        it('emitting single array containing all values', done => {
            let expected = [1, 2, 3]
                , actual;

            aeroflow(...expected).toArray().run(value => actual = value);

            setImmediate(() => {
                assert.isArray(actual);
                assert.sameMembers(actual, expected);
                done();
            });
        });
    });

    describe('#toMap()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.toMap));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().toMap(), 'Aeroflow'));

        it('emitting empty Map if empty flow', (done) => {
            let actual;

            aeroflow().toMap().run(value => actual = value);

            setImmediate(() => {
                assert.typeOf(actual, 'Map');
                assert.strictEqual(actual.size, 0);
                done();
            });
        });

        it('emitting single map containing all values', done => {
            let expected = [1, 2, 3]
                , actual;

            aeroflow(...expected).toMap().run(value => actual = value);

            setImmediate(() => {
                assert.typeOf(actual, 'Map');
                assert.includeMembers(Array.from(actual.keys()), expected);
                assert.includeMembers(Array.from(actual.values()), expected);
                done();
            });
        });
    });

    describe('#toSet()', ()=> {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.toSet));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().toSet(), 'Aeroflow'));

        it('emitting empty Set if empty flow', (done) => {
            let actual;

            aeroflow().toSet().run(value => actual = value);

            setImmediate(() => {
                assert.typeOf(actual, 'Set');
                assert.strictEqual(actual.size, 0);
                done();
            });
        });

        it('emitting single set containing all values', done => {
            let expected = [0, 1, 2, 3]
                , actual;

            aeroflow(...expected, ...expected).toSet().run(value => actual = value);

            setImmediate(() => {
                assert.typeOf(actual, 'Set');
                assert.sameMembers(Array.from(actual.keys()), expected);
                assert.sameMembers(Array.from(actual.values()), expected);
                done();
            });
        });
    });

    describe('#distinct()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.distinct));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().distinct(), 'Aeroflow'));

        it('emitting only unique values in sources with a same type', done => {
            let values = [1, 1, 1, 2, 2]
                , expected = [1, 2]
                , actual = [];

            aeroflow(...values).distinct().run(value => actual.push(value));

            setImmediate(() => {
                assert.strictEqual(actual.length, expected.length);
                assert.sameMembers(actual, expected);
                done();
            });
        });

        it('emitting only unique values in sources with different types', done => {
            let values = ['a', 'b', 1, new Date(), 2]
                , actual = [];

            aeroflow(...values).distinct().run(value => actual.push(value));

            setImmediate(() => {
                assert.strictEqual(actual.length, values.length);
                assert.sameMembers(actual, values);
                done();
            });
        });

        it('emitting only unique values if passed like one source', done => {
             let values = [1, 1, 1, 2, 2]
                , expected = [1, 2]
                , actual = [];

            aeroflow(values).distinct().run(value => actual.push(value));

            setImmediate(() => {
                assert.strictEqual(actual.length, expected.length);
                assert.sameMembers(actual, expected);
                done();
            });
        });
    });

    describe('#distinct(@Boolean)', () => {
        it('emitting unique values until it changed if true passed', done => {
             let values = [1, 1, 1, 2, 2, 1, 1]
                , expected = [1, 2, 1]
                , actual = [];

            aeroflow(...values).distinct(true).run(value => actual.push(value));

            setImmediate(() => {
                assert.strictEqual(actual.length, expected.length);
                assert.sameMembers(actual, expected);
                done();
            });
        });

        it('emitting unique values until it changed if false passed', done => {
             let values = [1, 1, 1, 2, 2, 1, 1]
                , expected = [1, 2]
                , actual = [];

            aeroflow(...values).distinct(false).run(value => actual.push(value));

            setImmediate(() => {
                assert.strictEqual(actual.length, expected.length);
                assert.sameMembers(actual, expected);
                done();
            });
        });
    });

    describe('#average()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.average));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().average(), 'Aeroflow'));

        it('does not invoke if empty flow', (done) => {
            let invoked = false;
            aeroflow().average()
                    .run(value => invoked = true);

            setImmediate(() => done(assert.isFalse(invoked)));
        });

        it('emitting average value of array', done => {
            let values = [1, 4, 7, 8]
                , expected = values.reduce((sum, next) => sum + next, 0)/values.length
                , actual;

            aeroflow(values).average().run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });

    describe('#count()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.count));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().count(), 'Aeroflow'));

        it('emitting 0 if empty flow', done => {
            let actual;

            aeroflow.empty.count().run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, 0)));
        });

        it('emitting the number of values in flow', done => {
            let values = [[1, 2], new Map(), () => {}, 'a']
                , expected = values.length
                , actual;

            aeroflow(...values).count().run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });

    describe('#sum()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.sum));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().sum(), 'Aeroflow'));

        it('does not invoke if empty flow', (done) => {
            let invoked = false;
            aeroflow.empty.sum()
                    .run(value => invoked = true);

            setImmediate(() => done(assert.isFalse(invoked)));
        });

        it('emitting NaN if not integer passed', done => {
            let values = []
                , actual = false;

            aeroflow('test').sum().run(value => actual = value);

            setImmediate(() => done(assert.isNotNumber(true)));
        });

        it('emitting sum of integer values', done => {
            let values = [1, 4, 7, 8]
                , expected = values.reduce((sum, next) => sum + next, 0)
                , actual;

            aeroflow(...values).sum().run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });
});