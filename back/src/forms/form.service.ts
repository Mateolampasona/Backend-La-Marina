import { Injectable } from "@nestjs/common";
import { ContactFormDto } from "./dto/contactForm.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactForm } from "./entity/formContact.entity";
import { Repository } from "typeorm";
import { sendContactFormToAdmins } from "src/Config/nodeMailer";

@Injectable()
export class FormService {
  
  constructor(@InjectRepository(ContactForm) private readonly contactFormRepository: Repository<ContactForm>) {}

  async contactForm(data: ContactFormDto) {
    const {name, email, subject, message} = data;
    if (!name || !email || !subject || !message) {
      throw new Error('All fields are required');
    }
    await this.contactFormRepository.create(data);
   const savedForm = await this.contactFormRepository.save(data);
   console.log(savedForm);
   await sendContactFormToAdmins(name, email, subject, message);
   console.log('Email sent to admins');
   
   
    return {message:"Form saved successfully", savedForm};
    

  }
}