const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function writeContacts(contacts) {
  try {
    return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.log(error);
  }
}

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);
  if (contactIndex === -1) return null;
  const newContacts = contacts.filter(({ id }) => id !== contactId);
  const deletedContact = contacts[contactIndex];
  writeContacts(newContacts);
  return deletedContact;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const contact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(contact);
  writeContacts(contacts);
  return contact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
