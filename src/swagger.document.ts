import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();
  
  public initializeOptions() {
    return this.builder
    	.setTitle('Swagger API')
    	.setDescription('Swagger API description')
    	.setVersion('1.0.0')
    	.addTag('swagger')
    	.build();
  }
}