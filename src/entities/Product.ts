import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rating } from './Rating';

@Entity({ name: 'Products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picurl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  amazonurl?: string;

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings?: Rating[];
}
