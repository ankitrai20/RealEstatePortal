const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const pool = require("./config/db");
const auth = require("./middleware/auth");
const upload = require("./middleware/upload");

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
app.post("/property", auth, upload.single("image"), async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, price, location } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const image = req.file.path;

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
// ================= MY PROPERTIES =================
app.get("/my-properties", auth, async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM properties
       WHERE owner_id = $1
       ORDER BY id DESC`,
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
// ================= DASHBOARD STATS =================
app.get("/dashboard-stats", auth, async (req, res) => {
  try {

    const properties = await pool.query(
      `SELECT COUNT(*) AS total_properties,
              COALESCE(SUM(price),0) AS total_value
       FROM properties
       WHERE owner_id=$1`,
      [req.user.id]
    );

    const wishlist = await pool.query(
      `SELECT COUNT(*) AS wishlist_count
       FROM wishlist
       WHERE user_id=$1`,
      [req.user.id]
    );

    res.json({
      totalProperties: Number(properties.rows[0].total_properties),
      totalValue: Number(properties.rows[0].total_value),
      wishlistCount: Number(wishlist.rows[0].wishlist_count),
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});
// ================= UPDATE PROPERTY =================
// ================= UPDATE PROPERTY =================
app.put("/property/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, price, location } = req.body;

    // Property exist karti hai ya nahi
    const oldProperty = await pool.query(
      "SELECT * FROM properties WHERE id=$1",
      [id]
    );

    if (oldProperty.rows.length === 0) {
      return res.status(404).json({
        message: "Property Not Found",
      });
    }

    // Default old image
    let image = oldProperty.rows[0].image;

    // Agar new image upload hui hai
    if (req.file) {
      image = req.file.path;
    }

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