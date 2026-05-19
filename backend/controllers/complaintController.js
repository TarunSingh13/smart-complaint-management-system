const Complaint = require('../models/Complaint');

// ADD COMPLAINT
exports.addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    if (!name || !email || !title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const complaint = await Complaint.create({ name, email, title, description, category, location });
    res.status(201).json({ message: 'Complaint registered successfully!', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL COMPLAINTS
exports.getAllComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.status(200).json({ message: 'Status updated!', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEARCH BY LOCATION
exports.searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ message: 'Location query required' });

    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' }
    });
    res.status(200).json({ count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE COMPLAINT
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.status(200).json({ message: 'Complaint deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SAVE AI ANALYSIS TO COMPLAINT
exports.saveAiAnalysis = async (req, res) => {
  try {
    const { priority, department, summary, autoResponse } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { aiAnalysis: { priority, department, summary, autoResponse } },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.status(200).json({ message: 'AI Analysis saved!', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};