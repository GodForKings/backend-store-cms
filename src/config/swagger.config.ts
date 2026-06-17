import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('REST API TEST')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .setContact('GodForKings', 'https://github.com/GodForKings', 'itdextrabusiness@gmail.com')
    .setLicense('JSON-doc', '/swagger.json')
    .addBearerAuth()
    .build();
};
