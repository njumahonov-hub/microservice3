import { ClientProxy } from "@nestjs/microservices";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @Inject("MATH_SERVICE") private readonly client: ClientProxy
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepo.save(createProductDto);
    this.client.emit("product_created", product);
    return product;
  }

  async findAll() {
    const products = await this.productRepo.find()
    this.client.emit("products_listed", products);
    return products;
  }

  async findOne(id: string) {
    return await this.productRepo.findOne({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productRepo.update(id, updateProductDto);
    const updated = await this.productRepo.findOne({ where: { id } });
    
    this.client.emit("product_updated", { id, ...updateProductDto });
    return updated;
  }

  async remove(id: string) {
    await this.productRepo.delete(id);
    this.client.emit("product_deleted", id);
    return { deleted: true };
  }
}