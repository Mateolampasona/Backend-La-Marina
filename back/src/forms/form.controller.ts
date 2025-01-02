import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { FormService } from "./form.service";
import { ContactFormDto } from "./dto/contactForm.dto";
import { MailDto } from "src/Users/dto/createUser.dto";
import { ApiProperty } from "@nestjs/swagger";

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}


  @Post('contact')
  @HttpCode(HttpStatus.OK)
  async contactForm(@Body() data: ContactFormDto) {
    try {
      console.log(data);
      
      return this.formService.contactForm(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('contact')
  @HttpCode(HttpStatus.OK)
  async getContactForms() {
    try {
      return this.formService.getContactForm();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('newsLetter')
  @HttpCode(HttpStatus.OK)
  async newsLetterForm(@Body() data: MailDto) {
    try {
      return this.formService.newsLetterForm(data);
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('newsLetter')
  @HttpCode(HttpStatus.OK)
  async getNewsLetterForms() {
    try {
      return this.formService.getNewsLetterForm();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  

}