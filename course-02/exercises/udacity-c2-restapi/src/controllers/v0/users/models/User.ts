import {
    Table,
    Column,
    Model,
    HasMany,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @Column
    public email!: string;

    @Column
    public passwordHash!: string; // use the bang (!) when a field can be null

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();

    short() {
        return {
            email: this.email,
        };
    }
}
