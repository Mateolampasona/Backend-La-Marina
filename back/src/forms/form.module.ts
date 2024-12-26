import { Module } from "@nestjs/common";
import { FormController } from "./form.controller";
import { FormService } from "./form.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactForm } from "./entity/formContact.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ContactForm])],
    controllers: [FormController],
    providers: [FormService],
    exports: []
})

export class FormModule {}