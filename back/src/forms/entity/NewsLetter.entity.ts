import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'newsletter' })
export class NewsLetter {
    @PrimaryGeneratedColumn({ name: 'newsletter_id' })
    newsletterId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;
}