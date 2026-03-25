import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      entities: [Product],
      synchronize: true,
  }),
    ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
