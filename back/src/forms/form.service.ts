import { Injectable } from "@nestjs/common";
import { ContactFormDto } from "./dto/contactForm.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactForm } from "./entity/formContact.entity";
import { Repository } from "typeorm";
import { sendContactFormToAdmins } from "src/Config/nodeMailer";
import { MailDto } from "src/Users/dto/createUser.dto";
import { NewsLetter } from "./entity/NewsLetter.entity";

@Injectable()
export class FormService {
  constructor(@InjectRepository(ContactForm) private readonly contactFormRepository: Repository<ContactForm>,
@InjectRepository(NewsLetter) private readonly newsLetterRepository: Repository<NewsLetter>) {}

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

 async  newsLetterForm(data: MailDto) {
    const {email} = data;
    if (!email) {
      throw new Error('Email field is required');
    }
    await this.newsLetterRepository.create(data);
    const savedForm = await this.newsLetterRepository.save(data);

    return {message:"Form saved successfully", savedForm};
  }

  async getContactForm() {
    const forms = await this.contactFormRepository.find();
    if(!forms){
      throw new Error('No forms found');
    }
    return forms
  }
  
  async getNewsLetterForm() {
    const forms = await this.newsLetterRepository.find();
    if(!forms){
      throw new Error('No forms found');
    }
    return forms
  }


}