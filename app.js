const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb')

const DATABASE_URL = 'mongodb+srv://anh20112001:anh20112001@cluster0.ukucj.mongodb.net/test'
const DATABASE_NAME = 'GCH0901_DB'

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"));

app.get('/', async(req, res) => {

    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).sort({ name: 1 }).limit(20).toArray()
    res.render('index', { products: results })
});

app.get('/product', async(req, res) => {
    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).sort({ name: 1 }).limit(20).toArray()
    res.render('product', { products: results })
});

app.get('/login', (req, res) => {
    res.render('login')
});



app.post('/about', (req, res) => {
    res.render('about')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/signup', (req, res) => {
    res.render('signup')
});





app.post('/signup', async(req, res) => {
    const accountnameInput = req.body.txtAccountName
    const accountpasswordInput = req.body.txtAccountPassword

    const newAG = { accountname: accountnameInput, accountpassword: accountpasswordInput }

    const dbo = await getDatabase()
    const result = await dbo.collection("AccountGuess").insertOne(newAG)

    res.redirect('/')
})

////

app.post('/login', async(req, res) => {
    const emailInput = req.body.txtEmail
    const passwordInput = req.body.txtPassword
    const dbo = await getDatabase()
    const results = await dbo.collection("AccountGuess").find({}).sort({ name: 1 }).limit(20).toArray()

    res.render('index')
});

app.get('/addnew', (req, res) => {
    res.render('addnew')
})
app.post('/addnew', async(req, res) => {
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const typeInput = req.body.txtType
    if (isNaN(priceInput) == true) {
        //Khong phai la so, bao loi, ket thuc ham
        const errorMessage = "Gia phai la so!"
        const oldValues = { name: nameInput, price: priceInput, picURL: picURLInput, type: typeInput }
        res.render('addnew', { error: errorMessage, oldValues: oldValues })
        return;
    }
    const newP = { name: nameInput, price: Number.parseFloat(priceInput), picURL: picURLInput, type: typeInput }

    const dbo = await getDatabase()
    const result = await dbo.collection("Products").insertOne(newP)

    res.redirect('/product')
})

app.get('/cart', async(req, res) => {
    res.render('cart')
    const name = req.body.txt.firstname

})

app.get('/delete', async(req, res) => {
    const id = req.query.id
    const dbo = await getDatabase()
    await dbo.collection("Products").deleteOne({ _id: ObjectId(id) })
    res.redirect('/product')
})



app.post('/edit', async(req, res) => {
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const typeInput = req.body.txtType
    const id = req.body.txtId

    if (isNaN(priceInput) == true) {
        //Khong phai la so, bao loi, ket thuc ham
        const errorMessage = "Gia phai la so!"
        const oldValues = { name: nameInput, price: priceInput, picURL: picURLInput, type: typeInput }
        res.render('edit', { error: errorMessage, oldValues: oldValues })
        return;
    }

    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: { name: nameInput, price: priceInput, type: typeInput, picURL: picURLInput } }
    const dbo = await getDatabase()
    await dbo.collection("Products").updateOne(myquery, newvalues)
    res.redirect('/product')
})

app.get('/edit', async(req, res) => {
    const id = req.query.id
    const dbo = await getDatabase()
    const productToEdit = await dbo.collection("Products").findOne({ _id: ObjectId(id) })
    res.render('edit', { product: productToEdit })
})


///////////////////
const PORT = process.env.PORT || 8000
app.listen(PORT)
console.log('Server is running')

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL)
    const dbo = client.db(DATABASE_NAME)
    return dbo
}