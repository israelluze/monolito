import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  modelName: 'ProductCatalogModel',
  tableName: "products",
  timestamps: true,
})
export default class ProductCatalogModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;  
  
}