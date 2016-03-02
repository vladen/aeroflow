import { EMITTER } from '../symbols';

export default function flowAdapter(flow) {
  return flow[EMITTER];
}
