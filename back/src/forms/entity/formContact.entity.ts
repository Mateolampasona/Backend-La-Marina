import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'form_contact' })
export class ContactForm {

    @PrimaryGeneratedColumn({ name: 'form_id' })
    formId: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    subject: string;

    @Column({ type: 'varchar', length: 500, nullable: false })
    message: string;

}