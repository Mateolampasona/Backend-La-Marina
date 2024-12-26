import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { FormService } from "./form.service";
import { ContactFormDto } from "./dto/contactForm.dto";

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

  

}