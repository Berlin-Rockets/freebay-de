const ItemModel = require('../models/itemModel');
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')

exports.getAllItems = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    // console.log(queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let query = ItemModel.find(queryObj);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // for our website: always sort by latest items only
      query = query.sort('-createdAt'); // for our website: always sort by latest items only
    }
    // limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // console.log(fields);
      query = query.select(fields);
    }
    // else {
    //   query = query.select('–__v');
    // }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numItems = await ItemModel.countDocuments()
    // }

    const items = await query;

    res.json({ success: true, Items: items.length, data: items });
  } catch (e) {
    console.log(e);
    next();
  }
};

// get all sorting Items 
exports.getItems = async (req, res, next) => {
  try {
    const items = await ItemModel.find({}).sort("-createdAt");
    res.json({ success: true,Items: items.length, data: items });

  } catch (err) {
    console.log(err.message);
  }
};

// post item
exports.postItem = async (req, res, next) => {
  // console.log(req.body);
  console.log('paaaaath',req.file.path);
  try {
    const item = new ItemModel(req.body);
    const result = await cloudinary.uploader.upload(req.file.path)
console.log('result', result);
    item.images=[...item.images,result.secure_url],
    item.cloudinary_id=  result.public_id

    await item.save();

    res.send({ success: true, data: item });
  } catch (err) {
    console.log(err.message);
  }
};


// // post item with cloudinary
// exports.postItemCloudinary = async (req, res, next) => {
 
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path)
//     res.send({ success: true, data: result });
//   } catch (err) {
//     console.log('error is:',err);
//   }
// };




// Filter items by Category or Location
exports.filterByOne = async (req, res, next) => {
  // console.log("start filter by one");
  const filterItem = req.params.filter;
  // console.log(filterItem);
  try {
    const filterByOneItems = await ItemModel.find({
      $or: [{ category: filterItem }, { location: filterItem }],
    }).sort("-createdAt");
    res.json({
      success: true,
      items: filterByOneItems.length,
      data: filterByOneItems,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// Filter items by Category and Location

exports.filterItems = async (req, res, next) => {
  const secFilterItem = req.params.both;
  const filterItem = req.params.filter;
  // console.log(filterItem);
  // console.log(secFilterItem);
  try {
    const filterItems = await ItemModel.find({
      $or: [
        { $and: [{ category: filterItem }, { location: secFilterItem }] },
        { $and: [{ location: filterItem }, { category: secFilterItem }] },
      ],
    }).sort("-createdAt");
    res.json({ success: true, items: filterItems.length, data: filterItems });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// get Single Item
exports.getSingleItem = async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const item = await ItemModel.findById(id).populate("userId");
    res.json({ success: true, data: item });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

// get specific user Items
exports.userItems = async (req, res, next) => {
  const { id } = req.params;
  // console.log({id});
  try {
    const items = await ItemModel.find({ userId: id }).sort("-createdAt");
    res.json(items);
    // console.log(Items);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};


// get sold/given Item
exports.givenItem = async (req, res, next) => {
  // console.log('start given controller');
  try {
    const givenItems = await ItemModel.find({ soldState: false });
    res.json({ success: true, items: givenItems.length, data: givenItems });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// get needed item - As a user, if I don’t find what I search, then I want to be provided with a suggestion to post my need for a specific item that I’m looking for.
exports.neededItem = async (req, res, next) => {
  // console.log('start given controller');
  try {
    const neededItems = await ItemModel.find({ postOrSearch: false });
    res.json({ success: true, items: neededItems.length, data: neededItems });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// Delete Item
exports.deleteItem = async (req, res, next) => {
  const id = req.params.id;
  try {
    await ItemModel.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      // data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
    next();
  }
};

// get Latest item – review & test later
// exports.getLatestItems = async (req, res, next) => {
//   try {
//     const queryObj = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     let query = ItemModel.find(queryObj);
//     if (req.query.sort) {
//       query = query.sort('-createdAt');
//     }
//     const items = await query;
//     res.json({ success: true, results: items.length, data: items });
//   } catch (e) {
//     console.log(e);
//   }
// };

// post/patch item (edit)
exports.editItem = async (req, res, next) => {
  const id = req.params.id;
  // console.log(req.params.id);
  try {
    const item = await ItemModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
