import type { Comment, TypeMessage } from '../../Domain';

export interface ICommentRepository {
  findByType(type: TypeMessage): Promise<Comment[]>;
  findById(id: number): Promise<Comment | null>;
  create(comment: Comment): Promise<Comment>;
  update(comment: Comment): Promise<Comment | null>;
}
