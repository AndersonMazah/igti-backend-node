import Sequelize from "sequelize";

const sequelize = new Sequelize(
    "postgresql://postgres:senha5432@localhost:5432/storedb",
    {
        dialect: "postgres",
        define: {
            timestamps: false
        }
    }
)

export default sequelize;