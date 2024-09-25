import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

//prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

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
});
const upload = multer({ storage: storage });
router.get('/', (req, res) => {
    res.send('Contacts route');
});

// Get all contacts
router.get('/all', async (req, res) => {
    const contacts = await prisma.contact.findMany();

    res.json(contacts);
});

// Get a contact by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    res.json(contact);
});

//Create a new contact (with Multer)
router.post('/create', upload.single('image'), async (req, res) => {
    const filename = req.file ? req.file.filename : null;
    const { firstName, lastName, email, phone, title } = req.body;

    //Checking required values are entered
    if(!firstName || !lastName || !email || !phone){
        //to-do: delete uploaded file
        return res.status(400).json({ message: 'Required field is missing.'});
    };

    const contact = await prisma.contact.create({
        data:{
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            title: title,
            filename: filename
        },
    });

    res.json(contact);
});

//Update contact by ID (with Multer)
//Updating *where* the ID is, not whole database
router.put('/update/:id', (req, res) => {
    const id = req.params.id;

    /*To-do:
            Capture input fields.

            Validate inputs.

            Get contact by ID. Return 404 if not found.

            If image file is uploaded: Get filename to save in DB. Delete the old image file. Set the filename to newfilename.
            If image file NOT uploaded: When updating record with Prisma, set the filename to oldfilename.

            Update record in DB (Exsuring filename is new or old name)
    */

    res.send('Update Contact by ID' + id);
});

//Delete contact by ID
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    /*To-do:
            Validate the ID number.

            Get contact by ID. Return 404 if not found.

            Delete the image file.
            
            Delete the contact in DB.
    */

    res.send('Delete Contact by ID' + id);
});

export default router;
