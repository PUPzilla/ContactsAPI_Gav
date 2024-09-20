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

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    res.send('Update Contact by ID' + id);
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    res.send('Delete Contact by ID' + id);
});



export default router;
