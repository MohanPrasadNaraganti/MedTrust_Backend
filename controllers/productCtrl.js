const Products = require('../models/productModel')



const productCtrl = {
    getProducts: async(req, res) =>{
        try {
        
            const products = await (Products.find())

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async(req, res) =>{
        try {
            const { title, price, description, content, imageURL, category} = req.body;
           

            // const product = await Products.findOne({_id})
            // if(product)
            //     return res.status(400).json({msg: "This product already exists."})

            const newProduct = new Products({
                 title: title.toLowerCase(), price, description, content, imageURL, category
            })
            // console.log(newProduct,"new")
            await newProduct.save()
            if(newProduct)
                 return res.status(200).json({msg: " product created successfully."})
            res.json({msg: "Created a product"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async(req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req, res) =>{
        try {
            const {title, price, description, content, imageURL, category} = req.body;
            

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, imageURL, category
            })

            res.json({msg: "Updated a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getProductById: async(req, res) =>{
        try {
            const productId = req.params.productId;
            const product = await Products.findById(productId);
            // console.log(product)s
        
            if (!product) {
              return res.status(404).json({ message: 'Could not find a product for the provided ID' });
            }
        
            res.status(200).json({ product });
          } catch (err) {
            return res.status(500).json({ msg: err.message });
          }
    }
}


module.exports = productCtrl