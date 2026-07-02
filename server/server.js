const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const pool = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// ================= HOME =================
app.get("/", (req, res) => {
  res.send("Real Estate Backend Running...");
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name,email,password)
       VALUES($1,$2,$3)
       RETURNING id,name,email,created_at`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= PROFILE =================
app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Welcome to your Profile",
    user: req.user,
  });
});

// ================= ADD PROPERTY =================
app.post("/property", auth, async (req, res) => {
  try {
    const { title, description, price, location, image } = req.body;

    const result = await pool.query(
      `INSERT INTO properties
      (title,description,price,location,image,owner_id)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        title,
        description,
        price,
        location,
        image,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Property Added Successfully",
      property: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= GET ALL PROPERTIES =================
app.get("/properties", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= UPDATE PROPERTY =================
app.put("/property/:id", auth, async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      price,
      location,
      image,
    } = req.body;

    const result = await pool.query(
      `UPDATE properties
       SET
         title=$1,
         description=$2,
         price=$3,
         location=$4,
         image=$5
       WHERE id=$6
       RETURNING *`,
      [
        title,
        description,
        price,
        location,
        image,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Property Not Found",
      });
    }

    res.json({
      message: "Property Updated Successfully",
      property: result.rows[0],
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
// ================= DELETE PROPERTY =================
app.delete("/property/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Property exists?
    const property = await pool.query(
      "SELECT * FROM properties WHERE id=$1",
      [id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({
        message: "Property Not Found",
      });
    }

    // Sirf owner hi delete kar sakta hai
    if (property.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this property",
      });
    }

    // Wishlist se bhi delete kar do (foreign key issue se bachne ke liye)
    await pool.query(
      "DELETE FROM wishlist WHERE property_id=$1",
      [id]
    );

    // Property delete
    await pool.query(
      "DELETE FROM properties WHERE id=$1",
      [id]
    );

    res.json({
      message: "Property Deleted Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
// ================= ADD TO WISHLIST =================
app.post("/wishlist", auth, async (req, res) => {

  try {

    const { property_id } = req.body;

    const existing = await pool.query(
      `SELECT * FROM wishlist
       WHERE user_id=$1 AND property_id=$2`,
      [req.user.id, property_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Property already in wishlist",
      });
    }

    const result = await pool.query(
      `INSERT INTO wishlist(user_id,property_id)
       VALUES($1,$2)
       RETURNING *`,
      [req.user.id, property_id]
    );

    res.status(201).json({
      message: "Added to Wishlist",
      wishlist: result.rows[0],
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

// ================= GET USER WISHLIST =================
app.get("/wishlist", auth, async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT
        wishlist.id,
        properties.*
      FROM wishlist
      JOIN properties
      ON wishlist.property_id = properties.id
      WHERE wishlist.user_id=$1
      ORDER BY wishlist.id DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

// ================= REMOVE FROM WISHLIST =================
app.delete("/wishlist/:propertyId", auth, async (req, res) => {

  try {

    const { propertyId } = req.params;

    await pool.query(
      `DELETE FROM wishlist
       WHERE user_id=$1
       AND property_id=$2`,
      [req.user.id, propertyId]
    );

    res.json({
      message: "Removed from Wishlist",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
// ================= DELETE PROPERTY =================
app.delete("/property/:id", auth, async (req, res) => {

  try {

    const { id } = req.params;

    // Check if property exists
    const property = await pool.query(
      "SELECT * FROM properties WHERE id=$1",
      [id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({
        message: "Property Not Found",
      });
    }

    // Check Owner
    if (property.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // Delete wishlist entries first
    await pool.query(
      "DELETE FROM wishlist WHERE property_id=$1",
      [id]
    );

    // Delete property
    await pool.query(
      "DELETE FROM properties WHERE id=$1",
      [id]
    );

    res.json({
      message: "Property Deleted Successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});