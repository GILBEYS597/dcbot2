import { DataTypes } from "sequelize";
import { sequelize } from "../database";

const User = sequelize.define("User",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    coinfliqAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    },
    {
       sequelize,
       tableName: "users",
    }
);


