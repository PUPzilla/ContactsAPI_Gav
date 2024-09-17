import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
});

// Get all contacts
router.get('/all', (req, res) => {
    res.send('All contacts');
});

// Get a contact by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send('Contact by id ' + id);
});

// to-do: add post, put, and delete routers
router.post('/create', (req, res) => {
    res.send('Create new Contact');
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
