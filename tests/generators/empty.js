export default (aeroflow, chai, exec, noop) => describe('.empty', () => {
  it('Gets instance of Aeroflow', () =>
    exec(
      noop,
      () => aeroflow.empty,
      result => chai.expect(result).to.be.an('Aeroflow')));

  it('Gets flow emitting "done" notification argumented with "true"', () =>
    exec(
      () => chai.spy(),
      spy => aeroflow.empty.notify(noop, spy).run(),
      spy => chai.expect(spy).to.have.been.called.with(true)));

  it('Gets flow not emitting "next" notification', () =>
    exec(
      () => chai.spy(),
      spy => aeroflow.empty.notify(spy).run(),
      spy => chai.expect(spy).not.to.have.been.called()));
});
