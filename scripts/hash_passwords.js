const bcrypt = require('bcryptjs');

async function hashPasswords() {
    const passwords = {
        'admin123': null,
        'support123': null,
        'finance123': null
    };

    for (const password of Object.keys(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        passwords[password] = hash;
        console.log(`${password}: ${hash}`);
    }
}

hashPasswords();
