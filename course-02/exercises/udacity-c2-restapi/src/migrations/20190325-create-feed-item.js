"use strict";

export function up(queryInterface, Sequelize) {
    return queryInterface.createTable("FeedItem", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        caption: {
            type: Sequelize.STRING,
        },
        url: {
            type: Sequelize.STRING,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
}

export function down(queryInterface) {
    return queryInterface.dropTable("FeedItem");
}
