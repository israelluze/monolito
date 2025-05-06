import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
  modelName: "ProductAdmModel",
  tableName: "products",
  timestamps: true,
})
export class ProductAdmModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  purchasePrice: number;

  @Column({ allowNull: false })
  stock: number;

  @Column({ allowNull: true })
  createdAt: Date;

  @Column({ allowNull: true })
  updatedAt: Date;
}