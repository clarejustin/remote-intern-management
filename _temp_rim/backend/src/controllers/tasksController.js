import Task from '../models/Task.js';

export async function listTasks(_req, res){ res.json(await Task.find().sort({createdAt:-1})); }
export async function getTask(req, res){
  const doc = await Task.findById(req.params.id);
  if(!doc) return res.status(404).json({message:'Not found'});
  res.json(doc);
}
export async function createTask(req, res){
  try {
    const doc = await Task.create(req.body);
    res.status(201).json(doc);
  } catch(e){ res.status(400).json({message:e.message}); }
}
export async function updateTask(req, res){
  try {
    const doc = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    if(!doc) return res.status(404).json({message:'Not found'});
    res.json(doc);
  } catch(e){ res.status(400).json({message:e.message}); }
}
export async function deleteTask(req, res){
  const doc = await Task.findByIdAndDelete(req.params.id);
  if(!doc) return res.status(404).json({message:'Not found'});
  res.json({ok:true});
}
