const Products = require("./../models/Products");
const Profiles = require("../models/Profiles");
const Banners = require("./../models/adBanner");
const Deals = require("./../models/deals");
const { PostToSocialMedia } = require("./../social/social");
const ProductRecord = require("../models/bookkeeping");





//search filter funnctionality

const filterProducts = async (req, res) => {
  try {
    const products = await Products.find({
      $text: { $search: req.query["product"] },
    }).lean();
    if (products.length === 0)
      return res.json({
        code: 200,
        data: [],
      });
    res.json({ code: 200, data: products });
  } catch (err) {
    res.json({ code: 500, err: err.message });
  }
};


const getCategory = async (req, res) => {
  const { category } = req.body;
  console.log(category)
  try {
    const data = await Products.find({ category: category }).sort({
      priority: -1,
      _id: 1,
    });
    res.json({ code: 201, category: data });
  } catch (err) {
    res.json({ code: 400, message: err.message });
  }
};

const getItemById = async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  //
  const item = await Products.findOne({ _id: id });
  res.json({ code: 201, item });
};
const getOfferById = async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  //
  try {
    const item = await Deals.findOne({ _id: id });
    console.log(item,id)
  return res.json({ code: 201, item });
  } catch (error) {
    console.log(error)
    return res.status(500)
  }
  
};

const addElectronics = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  // 
  const subs = profile.subscriptionLevel;
  const merchantProduct = profile.product;

  if(subs===0 && merchantProduct.length >=5) {
    return res.json({code:304, message:"Maximum number of product reached."})
  }


  // 
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "electronics",
    email: email,
    priority,
    images: images,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
  // saving profile ref
  profile.product.push(newProductId);
  profile.markModified('product');
  profile.save();
  // newProduct.save()
  //
  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };

  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });

  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  return res.json({ code: 201, msg: "posted to social", added: true });
};
const addHealth = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  // 
  const subs = profile.subscriptionLevel;
  const merchantProduct = profile.product;

  if(subs===0 && merchantProduct.length >=5) {
    return res.json({code:304, message:"Maximum number of product reached."})
  }


  // 
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "health",
    email: email,
    priority,
    images: images,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
  // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   profile.save();
  // newProduct.save()
  //
  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };

  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });

  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  return res.json({ code: 201, msg: "posted to social", added: true });
};
const addFashion = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    size,
    gender,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;
  // 
  const subs = profile.subscriptionLevel;
  const merchantProduct = profile.product;

  if(subs===0 && merchantProduct.length >=5) {
    return res.json({code:304, message:"Maximum number of product reached."})
  }


  // 
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "fashion",
    email: email,
    priority,
    size,
    gender,
    images: images,
    quantity,
    salesTarget,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
   // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   profile.save();

  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };

  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  //   social commerce
  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });
  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  res.json({ code: 201, msg: "posted to social", added: true });
};
const addPhoneTablet = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "phones-tablets",
    email: email,
    priority,
    images: images,
    quantity,
    salesTarget,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
   // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   profile.save();

  //
  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };

  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  // social commerce
  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });
  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  return res.json({ code: 201, msg: "posted to social", added: true });
};
const addHome = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    room,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;

  // 
  const subs = profile.subscriptionLevel;
  const merchantProduct = profile.product;

  if(subs===0 && merchantProduct.length >=5) {
    return res.json({code:304, message:"Maximum number of product reached."})
  }


  // 
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "home-kitchen-appliance",
    email: email,
    priority,
    room,
    images: images,
    quantity,
    salesTarget,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
   // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   profile.save();

  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };

  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  //   social commerce
  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });
  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  return res.json({ code: 201, msg: "posted to social", added: true });
};

const addVehicle = async (req, res) => {
  const {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    year,
    fuelType,
    transmission,
    images,
    quantity,
    salesTarget,
  } = req.body;
  // console.log(req.body)
  const { email } = req.user;
  const profile = await Profiles.findOne({ email: email });
  const merchantId = profile._id
  const storeInfo = profile.storeInfo;
  // 
  const subs = profile.subscriptionLevel;
  const merchantProduct = profile.product;

  if(subs===0 && merchantProduct.length >=5) {
    return res.json({code:304, message:"Maximum number of product reached."})
  }


  // 
  if (!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName)
    return res.json({ code: 404, message: "Please update store info" });
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    condition,
    storeInfo,
    category: "vehicle",
    email: email,
    priority,
    year,
    fuelType,
    transmission,
    images: images,
    quantity,
    salesTarget,
    merchant:merchantId
  };
  const newProduct = new Products(item);
  const newProductId = newProduct._id;
   // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   profile.save();

  //    newProduct.save()

  // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total: Number(quantity) * Number(price),
    quantity: Number(quantity),
    salesTarget: Number(quantity),
    description,
    storeInfo,
    email,
  };
  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  newProduct.save();
  try {
    newStock.save();
  } catch (error) {
    console.log(error);
  }

  //   social commerce

  if (profile.subscriptionLevel !== 3)
    return res.json({ code: 201, msg: "product added" });
  // Post to social media
  const data = {
    title: `Get ${title} for just N${Number(price).toLocaleString(
      "en-US"
    )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
    imageUrl: images[0],
  };
  const socialPosting = await PostToSocialMedia(email, data);
  if (!socialPosting)
    return res.json({ code: 400, msg: "Failed to post to social media" });
  // Posted
  return res.json({ code: 201, msg: "posted to social", added: true });
};

const getLandinpPage = async (req, res) => {
  try {
    const banners = await Banners.find();
    const deals = await Deals.find();
    const approvedBanners = banners.filter((banner) => banner.approval);
    const products = await Products.find().populate([{
      path: "merchant",
      select:"product",
        populate: {
          path: "product",
        },
    }]).sort({ priority: -1, _id: 1 });
    res.json({ banner: approvedBanners, products: products, deals: deals });
  } catch (error) {
    return res.status(500)
  }
 
};

// add offered services 
const addServices = async (req,res) => {
  const {
    title,
    description,
    images,
    price,
    brand,
    subCategory
  } = req.body

  const {email} = req.user;
  const profile = await Profiles.findOne({ email: email });
  const merchantId = profile._id;
  const priority = profile.subscriptionLevel;
  const item = {
    title,
    description,
    price,
    brand,
    subCategory,
    category: "services",
    email: email,
    priority,
    images: images,
    merchant:merchantId
  };

  const newProduct = new Products(item);
  const newProductId = newProduct._id;
   // saving profile ref
   profile.product.push(newProductId);
  profile.markModified('product');
   await profile.save();

   // stock code
  const stockRecord = {
    productName: title,
    cost: Number(0),
    price: Number(price),
    total:Number(price),
    email,
  };
  const newStock = new ProductRecord(stockRecord);
  const stockId = newStock._id;
  newProduct.stock = stockId;
  await newProduct.save();
  try {
   await newStock.save();
  } catch (error) {
    console.error(error);
  }
  
   //   social commerce
  if (profile.subscriptionLevel !== 3)
  return res.json({ code: 201, msg: "product added" });
// Post to social media
const data = {
  title: `Get ${title} for just N${Number(price).toLocaleString(
    "en-US"
  )}. Click for more details https://exciteenterprise.com/services/marketplace/products/item/${newProductId}`,
  imageUrl: images[0],
};
const socialPosting = await PostToSocialMedia(email, data);
if (!socialPosting)
  return res.json({ code: 400, msg: "Failed to post to social media" });
// Posted
return res.json({ code: 201, msg: "posted to social", added: true });


}

module.exports = {
  filterProducts,
  getCategory,
  getItemById,
  addElectronics,
  addFashion,
  addPhoneTablet,
  addHome,
  addVehicle,
  addHealth,
  getOfferById,
  getLandinpPage,
  addServices
};
