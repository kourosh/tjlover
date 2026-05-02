import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity({ name: 'Ratings' })
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'real' })
  stars!: number;

  @ManyToOne(() => User, (user) => user.ratings, { nullable: true, onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(() => Product, (product) => product.ratings, { nullable: true, onDelete: 'SET NULL' })
  product?: Product;
}
