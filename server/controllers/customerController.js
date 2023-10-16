const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const { MongoClient } = require("mongodb");
const unorm = require("unorm");

exports.homepage = async (req, res) => {
  const messages = await req.consumeFlash("info");
  const locals = {
    title: "SimpliAdmin - Dashboard",
    description:
      "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
  };

  // Define the number of users to display per page and the current page
  let perPage = 8;
  let page = req.query.page || 1;

  try {
    // Query the database to retrieve a list of users (customers)
    const customers = await Customer.find()
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    console.log(
      "🚀 ~ file: customerController.js:59 ~ exports.homepage= ~ customers:",
      customers
    );

    // .sort({ updatedAt: -1 })
    console.log(customers);

    const count = await Customer.countDocuments();

    res.render("index", {
      locals,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

// get - about page
exports.about = async (req, res) => {
  const locals = {
    title: "About - SimpliAdmin",
    description:
      "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};

// get - new customer form
exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Customer - SimpliAdmin",
    description:
      "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
  };

  res.render("customer/add", locals);
};

// post - create new customer
exports.postCustomer = async (req, res) => {
  // generate customer object
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    details: req.body.details,
  });

  const locals = {
    title: "New Customer Added!",
    description:
      "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
  };

  try {
    // access the model declared above and pass in the generated object / user data from the form
    await newCustomer.save();
    await req.flash("info", "New customer has been added.");
    //redirect back to dashboard after adding new Customer
    res.redirect("/");
  } catch (error) {
    console.log(`🔴🔴🔴 New Customer Creation Failed: ${error}`);
  }
};

// VIEW - view customer data
exports.viewCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: "View Customer Data - SimpliAdmin",
      description:
        "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
    };

    res.render("customer/view", { locals, customer });
  } catch (error) {
    console.log(`🔴🔴🔴 Customer Data Loading Failed: ${error}`);
  }
};

// GET - edit customer data
exports.editCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Customer Data - SimpliAdmin",
      description:
        "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
    };

    res.render("customer/edit", { locals, customer });
  } catch (error) {
    console.log(`🔴🔴🔴 Customer Data Loading Failed: ${error}`);
  }
};

// PUT - Update Customer Data
exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      // updatedAt: Date.now(),
    });

    res.redirect(`/edit/${req.params.id}`);
  } catch (error) {
    console.log(`🔴🔴🔴 Customer Data Update Failed: ${error}`);
  }
};

// DELETE - Delete Customer Data
exports.deletePost = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(`🔴🔴🔴 Customer Data Deletion Failed: ${error}`);
  }
};

// GET - Search

exports.searchCustomer = async (req, res) => {
  const locals = {
    title: "Search Customer Data - SimpliAdmin",
    description:
      "SimpliAdmin is a Node.js CRUD app using Express, MongoDB, EJS, and Bootstrap for easy user data management.",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = unorm
      .nfd(searchTerm)
      .replace(/[^a-zA-Z0-9 ]/g, "");
    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};
