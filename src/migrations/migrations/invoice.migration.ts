import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    // Criação da tabela 'invoice'
    await sequelize.getQueryInterface().createTable('invoice', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        document: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        complement: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Criação da tabela 'invoice_items'
    await sequelize.getQueryInterface().createTable('invoice_items', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        invoiceId: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'invoice',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
    });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    // Exclusão das tabelas na ordem inversa para evitar problemas de dependência
    await sequelize.getQueryInterface().dropTable('invoice_items');
    await sequelize.getQueryInterface().dropTable('invoice');
};