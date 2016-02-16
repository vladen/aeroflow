export default (aeroflow, assert) => describe('slice', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.slice);
  });

  describe('slice()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.slice(), 'Aeroflow');
    });

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.slice().run(fail, done))));

    it('Emits @values when any param not passed', () => {
      const values = [1, 2];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice().toArray().run(done, fail)),
        values);
    });
  });

  describe('slice(@start:number)', () => {
    it('Emits @start number of @values from the start', () => {
      const values = [1, 2, 3], slice = 2, expectation = values.slice(slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(slice).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @start number of @values from the end', () => {
      const values = [1, 2, 3], slice = -2, expectation = values.slice(slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(slice).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('slice(@start:!number)', () => {
    it('Emits @values when passed non-numerical @start', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice('test').toArray().run(done, fail)),
        values);
    });
  });

  describe('slice(@start:number, @end:number)', () => {
    it('Emits @values within @start and @end indexes from the start', () => {
      const values = [1, 2, 3], slice = [1, 2], expectation = values.slice(...slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(...slice).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values within @start and @end indexes from the end', () => {
      const values = [1, 2, 3], slice = [-2, -1], expectation = values.slice(...slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(...slice).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('slice(@start:number, @end:!number)', () => {
    it('Emits @values from @start index till the end', () => {
      const values = [1, 2], start = 1, expectation = values.slice(start);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(start, 'test').toArray().run(done, fail)),
        expectation);
    });
  });
});