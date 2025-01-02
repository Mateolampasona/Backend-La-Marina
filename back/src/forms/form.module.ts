import { Module } from "@nestjs/common";
import { FormController } from "./form.controller";
import { FormService } from "./form.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactForm } from "./entity/formContact.entity";
import { NewsLetter } from "./entity/NewsLetter.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ContactForm, NewsLetter])],
    controllers: [FormController],
    providers: [FormService],
    exports: []
})

export class FormModule {}