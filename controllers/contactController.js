import Contact from "../models/contact.js";

export async function submitContact(req, res) {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({
      message: "Your message was submitted successfully! We will be in touch soon.",
      contact
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to submit message." });
  }
}

export async function getContacts(req, res) {
  try {
    const contacts = await Contact.find().sort({ isRead: 1, createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
}

export async function updateContactStatus(req, res) {
  try {
    const contactId = req.params.id;
    const { isRead } = req.body;

    if (typeof isRead !== "boolean") {
      return res.status(400).json({ message: "'isRead' must be a boolean." });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { isRead },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found." });
    }

    res.status(200).json({
      message: `Message marked as ${isRead ? "read" : "unread"} successfully.`,
      contact
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update message status." });
  }
}

export async function deleteContact(req, res) {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found." });
    }

    res.status(200).json({ message: "Contact message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message." });
  }
}