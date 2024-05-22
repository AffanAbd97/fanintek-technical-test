const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const Joi = require("joi");

const register = async (req, res) => {
  const Validation = Joi.object({
    nama: Joi.string().min(3).required().messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name is required",
      "string.min": "Name should have a minimum length of {#limit}",
      "any.required": "Name is a required field",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "any.required": "Email is a required field",
    }),
    npp: Joi.number().required().messages({
      "string.base": "NPP should be a type of number",
      "string.empty": "NPP is required",
      "any.required": "NPP is a required field",
    }),
    npp_supervisor: Joi.number().messages({
      "string.base": "NPP Supervisor should be a type of number",
      "string.empty": "NPP Supervisor is required",
      
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password is required",
      "string.min": "Password should have a minimum length of {#limit}",
      "any.required": "Password is a required field",
    }),
  });
  const { error } = Validation.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }
  const { nama, email, npp, npp_supervisor, password } = req.body;
  const existUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existUser) {
    return res.status(409).send({
      error: "Email Already Registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: { nama, email, password: hashedPassword, npp, npp_supervisor },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const Validation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "any.required": "Email is a required field",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password is required",
      "string.min": "Password should have a minimum length of {#limit}",
      "any.required": "Password is a required field",
    }),
  });
  const { error } = Validation.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(409).send({
        error: "Email Not Registered",
      });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        data: {
          nama: user.nama,
          email: user.email,
        },

        token: accessToken,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { register,login };
