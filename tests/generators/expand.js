export default (aeroflow, assert) => describe('Aeroflow#expand', () => {
  it('is static method', () => {
    assert.isFunction(aeroflow.expand);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.expand(), 'Aeroflow');
    });
  });

  describe('(@function)', () => {
    
  });

  describe('(@!function)', () => {
    
  });
});