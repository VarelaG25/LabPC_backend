import type { ICommentRepository } from '../../Application';
import { Comment, TypeMessage } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class CommentRepository implements ICommentRepository {
  constructor(private readonly context: IDataContext<Comment>) {}

  async findByType(type: TypeMessage): Promise<Comment[]> {
    const comments = await this.context.find({ type });
    return comments.filter((comment) => comment.changeControl?.eliminated !== 1);
  }

  async findById(id: number): Promise<Comment | null> {
    const comment = await this.context.findOne({ id });
    return comment && comment.changeControl?.eliminated !== 1 ? comment : null;
  }

  async create(comment: Comment): Promise<Comment> {
    comment.id = await this.context.nextId();
    return this.context.insertOne(comment);
  }

  async update(comment: Comment): Promise<Comment | null> {
    return this.context.updateOne({ id: comment.id }, { $set: { ...comment } });
  }
}
