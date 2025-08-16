import Intern from '../models/Intern.js';

export async function listInterns(req, res) {
  const interns = await Intern.find().sort({ createdAt: -1 });
  res.json(interns);
}

export async function createIntern(req, res) {
  try {
    const intern = await Intern.create(req.body);
    res.status(201).json(intern);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

export async function getIntern(req, res) {
  const intern = await Intern.findById(req.params.id);
  if (!intern) return res.status(404).json({ message: 'Not found' });
  res.json(intern);
}

export async function updateIntern(req, res) {
  const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!intern) return res.status(404).json({ message: 'Not found' });
  res.json(intern);
}

export async function deleteIntern(req, res) {
  const r = await Intern.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}
