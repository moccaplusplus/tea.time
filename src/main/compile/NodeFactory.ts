import { Node } from './Node';

export interface NodeFactory<T> {
  readonly token: string;
  forOccurrence(repeatCount: number): Node<T>;
}
