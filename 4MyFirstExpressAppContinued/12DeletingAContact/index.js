const path = require('node:path');
const express = require('express');

// A runnable final lesson; earlier lesson snapshots are preserved unchanged.
function createApp() {
    const app = express();
    const contacts = [
        { name: 'Arpan', phone: '1234567890' },
        { name: 'SRK', phone: '0987654321' },
        { name: 'Laraib', phone: '5647839210' }
    ];
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.urlencoded({ extended: false, limit: '16kb' }));
    app.use(express.static(path.join(__dirname, 'assets')));
    app.get('/', (_req, res) => res.render('home', { title: 'My Contact Lists', contact_List: contacts }));
    app.get('/practice', (_req, res) => res.render('practice', { title: 'Playground is Up!' }));
    app.post('/create-contact', (req, res) => {
        const { name, phone } = req.body;
        if (typeof name !== 'string' || !name.trim() || name.trim().length > 100 ||
            typeof phone !== 'string' || !/^\+?[0-9 -]{3,30}$/.test(phone)) {
            return res.status(400).send('Provide a name and a valid phone number.');
        }
        if (contacts.some(contact => contact.phone === phone.trim())) {
            return res.status(409).send('That phone number already exists.');
        }
        contacts.push({ name: name.trim(), phone: phone.trim() });
        return res.redirect(303, '/');
    });
    app.post('/delete-contact', (req, res) => {
        const phone = req.body.phone;
        if (typeof phone !== 'string') return res.status(400).send('Provide a phone number.');
        const index = contacts.findIndex(contact => contact.phone === phone);
        if (index === -1) return res.status(404).send('Contact not found.');
        contacts.splice(index, 1);
        return res.redirect(303, '/');
    });
    return app;
}

if (require.main === module) {
    const port = Number(process.env.PORT || 8000);
    createApp().listen(port, '127.0.0.1', () => console.log(`Contacts lesson: http://127.0.0.1:${port}`));
}
module.exports = { createApp };
