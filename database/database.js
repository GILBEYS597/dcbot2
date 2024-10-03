import { Sequelize } from "sequelize";

const env = process.env;
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST,} = env;

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mariadb",
});

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Veritabanına bağlantı başarılı.");

        await sequelize.sync({alter: true});
        console.log("Veritabanında modellere gerekli değişiklikler yapıldı.");
    } catch (err) {
        console.error(`Veritabanına bağlantı hatası: ${err}`);
    }
}

export default sequelize;

