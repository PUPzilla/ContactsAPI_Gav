import express from 'express';
import multer from 'multer';

const router = express.Router();

//Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); //Save uploaded files in 'public/images' folder
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const newfilename = Date.now() + '_' + Math.round(Math.random() * 1000) + '.' + ext;
        cb(null, newfilename);
    }
})
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
});

// Get all contacts
router.get('/all', (req, res) => {
    res.send('All contacts');
});

// Get a contact by id
router.get('/:id', (req, res) => {
    const id = req.params.id;

//To-do: Verify ID is a number

//To-do: Get contact record in database by ID #

    res.send('Contact by id ' + id);
});

//To-do: add post, put, and delete routers
//Create a new contact
router.post('/create', upload.single('image'), (req, res) => {
    const { firstName, lastName, phone, email } = req.body;
    const filename = req.file ? req.file.filename : null;

    const contact = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        filename: filename
    }

    //Use prisma to save new contact in database

    res.send(`New Contact: ${firstName} ${lastName} ${filename}`);
});

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    res.send('Update Contact by ID' + id);
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    res.send('Delete Contact by ID' + id);
});



export default router;
