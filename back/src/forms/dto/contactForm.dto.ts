import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class ContactFormDto {
    @ApiProperty({
        type:String,
        description:'The name of the user'
    })
    @IsNotEmpty()
    name:string


    @IsEmail()
    @ApiProperty({
        type:String,
        description:'The email of the user'
    })
    email:string


    @IsString()
    @ApiProperty({
        type:String,
        description:'The subject of the message'
    })
    subject:string

    @IsString()
    @ApiProperty({  
        type:String,
        description:'The message'
    })
    message:string


}