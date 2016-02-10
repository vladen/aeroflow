export default (aeroflow, assert) => describe('Aeroflow#reduce', () => {
  it('is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('()', () => {
    it('returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));
    it('emits nothing from an empty flow', done => new Promise(resolve => 
      aeroflow.empty.reduce().run(
        result => resolve(assert.ok(false)),
        result => resolve())));
  });

  describe('(@function)', () => {
    
  });

  describe('(@function, @boolean)', () => {
    
  });

  describe('(@function, @!boolean)', () => {
    
  });

  describe('(@function, @boolean, @boolean)', () => {
    
  });

  describe('(@!function)', () => {
    
  });

});
