const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const jwt = require("jsonwebtoken");
const Model = require("./utils/mode");
const userModel = require("./utils/userModel");
const router = express.Router();

cloudinary.config({
  cloud_name: "dry8nywub",
  api_key: "629241972579982",
  api_secret: "Pc2-culzxkssn7oX8SIZoMLR6vc"
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  }
});
const upload = multer({ storage: storage }).single("picture");

router.get("/user", async (req, res) => {
  const getModel = await userModel.find();
  res.status(200).json({ message: "found", data: getModel });
});

router.get("/user/:id", async (req, res) => {
  const getModel = await userModel.findById(req.params.id);
  res.status(200).json({ message: "found", data: getModel });
});

router.patch("/user/:id", async (req, res) => {
  const getModel = await userModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });
  res.status(200).json({ message: "found", data: getModel });
});

router.post("/register", upload, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const hSalt = await bcrypt.genSalt(10);
    const hHsalt = await bcrypt.hash(password, hSalt);

    const userImage = await cloudinary.uploader.upload(req.file.path);

    const getModel = await userModel.create({
      email,
      name,
      password: hHsalt,
      picture: userImage.secure_url,
      pictureID: userImage.public_id
    });
    res.status(201).json({ message: "created", data: getModel });
  } catch (err) {
    res.status(400).json({ message: `Try again ${err.message}` });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (checkPassword) {
      const { password, ...info } = findUser._doc;
      const token = jwt.sign(
        {
          id: findUser._id,
          name: findUser._name,
          email: findUser.email,
          isAdmin: findUser.isAdmin
        },
        "THIswhatWEAreTalkINGABOutt",
        { expiresIn: "1d" }
      );
      res.status(201).json({
        message: "Welcome Back",
        data: {
          ...info,
          token
        }
      });
    } else {
      res.status(400).json({ message: "check your password, again" });
    }
  } else {
    res.status(400).json({ message: "user isn't on our database" });
  }
});

const verified = async (req, res, next) => {
  try {
    const tokenAuth = req.headers.authorization;
    if (tokenAuth) {
      const token = token.split(" ")[1];
      jwt.verify(token, "THIswhatWEAreTalkINGABOutt", (error, payload) => {
        if (error) {
          res.status(400).json({ message: "Please check your Token" });
        } else {
          req.user = payload;
          next();
        }
      });
    } else {
      res.status(400).json({ message: `You don't have access` });
    }
  } catch (err) {
    res.status(400).json({ message: `Let's do this Again : ${err.message} ` });
  }
};

const verified2 = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (authToken) {
      const token = authToken.split(" ")[1];

      jwt.verify(token, "THIswhatWEAreTalkINGABOutt", (error, payload) => {
        if (error) {
          res.status(400).json({ message: "Please check your Token again!" });
        } else {
          req.user = payload;
          next();
        }
      });
    } else {
      res.status(400).json({ message: "something is wrong with this TOKEN" });
    }
  } catch (err) {
    res.status(400).json({ message: "you don't have right to this operation" });
  }
};

router.get("/", async (req, res) => {
  const getModel = await Model.find();
  res.status(200).json({ message: "found", data: getModel });
});

router.get("/:id", async (req, res) => {
  const getModel = await Model.findById(req.params.id, req.body);
  res.status(200).json({ message: "found Individual", data: getModel });
});

router.patch("/:id", async (req, res) => {
  const getModel = await Model.findByIdAndUpdate(
    req.params.id,
    {
      point: req.body.point
    },
    { new: true }
  );
  res.status(200).json({ message: "updated data", data: getModel });
});

router.delete("/:id", async (req, res) => {
  const getModel = await Model.findByIdAndRemove(req.params.id);
  res.status(200).json({ message: "deleted" });
});

router.post("/", verified2, upload, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { position, name, point } = req.body;

      const image = await cloudinary.uploader.upload(req.file.path);
      console.log(image);
      const getModel = await Model.create({
        point,
        name,
        position,
        pictureID: image.public_id,
        picture: image.secure_url
      });
      res.status(200).json({ message: "created", data: getModel });
    } else {
      res.status(400).json({ message: "You can't carry out this Operation" });
    }
  } catch (err) {
    res.status(400).json({ message: `Try again ${err.message}` });
  }
});

module.exports = router;
