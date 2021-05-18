const createDB = require("../../bootstrap/database");
const hashService = require("../../services/hash");

exports.create = async (data) => {
  try {
    const db = await createDB();

    const query = `INSERT INTO users (user_id, first_name, last_name, email,phone,password) VALUES (?,?,?,?,?,?)`;
    const [rows] = await db.execute(query, data);

    if (!rows.affectedRows > 0) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

exports.update = async (data = {}, where = {}) => {
  try {
    const db = await createDB();

    const dataValue = Object.keys(data)
      .map((key) => `${key} ='${data[key]}'`)
      .join(",");

    const conditions = Object.keys(where)
      .map((key) => `${key} ='${where[key]}'`)
      .join(",");

    const query = `UPDATE users SET ${dataValue} WHERE ${conditions}`;

    const result = await db.execute(query);

    if (!result[0].affectedRows) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

exports.getUserBy = async (field, value) => {
  try {
    const db = await createDB();

    const query = `SELECT * FROM users WHERE ${field}=?`;
    const [rows] = await db.execute(query, [value]);

    if (!rows.length > 0) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      data: rows[0],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
      message: error.message,
    };
  }
};

exports.authenticate = async (email, password) => {
  const user = await this.getUserBy("email", email);

  if (!user.success) {
    return {
      success: false,
    };
  }

  const isValidPassword = hashService.comparePassword(
    password,
    user.data.password
  );

  if (!isValidPassword) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    user: user.data,
  };
};
