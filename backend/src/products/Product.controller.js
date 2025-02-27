const Product = require('./Product.model'); // Ensure you have the correct path to your Product model

const postProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send( products );
  } catch (err) {
    console.error("error", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).send(product);
    } catch (err) {
      console.error("error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const editProduct = async (req, res) => { 
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);

    }
    catch(err){
      console.error("error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("error", err);
      res.status(500).json({ message: "Internal server error" })}};
  const recognizeProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const prediction = await classifyImage(req.file.buffer);

        // Use regex for a partial match or a library like Fuse.js for fuzzy matching
        const product = await Product.findOne({ name: { $regex: new RegExp(prediction.label, 'i') } });

        if (!product) {
            return res.status(404).json({ message: 'No matching product found' });
        }

        res.status(200).json({ prediction, product });
    } catch (error) {
        res.status(500).json({ message: `Error recognizing product: ${error.message}` });
    }
};
 
module.exports = { postProduct, getProducts, getProduct, editProduct, deleteProduct};