import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }
}