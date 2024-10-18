import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

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
        const uniquefilename = Date.now() + '_' + Math.round(Math.random() * 1000) + '.' + ext;
        cb(null, uniquefilename);
    }
});

const upload = multer({ storage: storage });

// Get all contacts
router.get('/all', async (req, res) => {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
});

// Get a contact by id
router.get('/get/:id', async (req, res) => {
    const id = req.params.id;
    
    if(isNaN(id)){
        return res.status(400).json({ message: 'Invalid contact ID.'});
    }

    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if(contact) {
        res.json(contact);
    } else {
        res.status(404).json({ message: 'Contact not found.'});
    }
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
router.put('/update/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;

    //  To-do:
    //  Capture input fields.
    const {firstName, lastName, email, phone, title} = req.body;
    const newFilename = req.file ? req.file.filename : null;

    //  Validate inputs.
    if(isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID #.'});
    }

    //  Get contact by ID. Return 404 if not found.
    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if(contact === null) {
        return res.status(404).json({ message: 'Contact not found.'});
    }

    //  Delete old file if new file uploaded
    if(newFilename && contact.filename){
        fs.unlink(`public/images/${contact.filename}`, (err) => {
            if(err) {
                console.error(err);
            }
        });
    }

    //  Update record
    const updatedContact = await prisma.contact.update({
        where: {
        id: parseInt(id),
        },
        data: {
            firstName: firstName,
            lastName: lastName,
            title: title || null,
            email: email,
            phone: phone,
            filename: newFilename || contact.filename,
        },
    });

    // Update record in DB (Exsuring filename is new or old name)

    res.json(updatedContact);
});

//Delete contact by ID
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    //  To-do:
    //  Validate the ID number.
    if(isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID #.'});
    }

    //  Get contact by ID. Return 404 if not found.
    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if(contact === null) {
        return res.status(404).json({ message: 'Contact not found.'});
    }

    //  Delete the image file.
    if(contact.filename){
        
    }
    
    //  Delete the contact in DB.

    res.send('Delete Contact by ID' + id);
});

export default router;
