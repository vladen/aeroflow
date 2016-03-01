export default (aeroflow, assert) => describe('.random', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.random));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.random(), 'Aeroflow'));

    it('Emits random values decimals within 0 and 1', () => {
      const count = 10, expectation = (value) => !Number.isInteger(value) && value >= 0 && value <= 1;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random().take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start:number)', () => {
    it('Emits random demical values less than @start if @start', () => {
      const start = 2, count = 10, expectation = (value) => !Number.isInteger(value) && value <= start;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start:string)', () => {
    it('Emits random decimals values within 0 and 1', () => {
      const start = 'test', count = 10, 
        expectation = (value) => !Number.isInteger(value) && value >= 0 && value <= 1;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start, @end:number)', () => {
    it('Emits random integer values within @start and @end if @start and @end is integer', () => {
      const start = 10, end = 20, count = 10, 
        expectation = (value) => Number.isInteger(value) && value >= start && value <= end;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });

    it('Emits random demical values within @start and @end if @start or @end is demical', () => {
      const start = 1, end = 2.3, count = 10, 
        expectation = (value) => !Number.isInteger(value) && value >= start && value <= end;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start, @end:string)', () => {
    it('Emits random demical values less than @start if @start', () => {
      const start = 2, end = 'test', count = 10,
        expectation = (value) => !Number.isInteger(value) && value <= start;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });
  });
});
