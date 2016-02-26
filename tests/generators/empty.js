export default (aeroflow, exec, expect, sinon) => describe('.empty', () => {
  it('Gets instance of Aeroflow', () =>
    exec(
      null,
      () => aeroflow.empty,
      result => expect(result).to.be.an('Aeroflow')));

  it('Gets flow emitting "done" notification argumented with "true"', () =>
    exec(
      () => sinon.spy(),
      spy => aeroflow.empty.notify(Function(), spy).run(),
      spy => expect(spy).to.have.been.calledWith(true)));

  it('Gets flow not emitting "next" notification', () =>
    exec(
      () => sinon.spy(),
      spy => aeroflow.empty.notify(spy).run(),
      spy => expect(spy).not.to.have.been.called));
});
