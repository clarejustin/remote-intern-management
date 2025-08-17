import Timesheet from '../models/Timesheet.js';

export async function listTimesheets(_req, res){ res.json(await Timesheet.find().sort({createdAt:-1})); }
export async function getTimesheet(req, res){
  const doc = await Timesheet.findById(req.params.id);
  if(!doc) return res.status(404).json({message:'Not found'});
  res.json(doc);
}
export async function createTimesheet(req, res){
  try {
    const doc = await Timesheet.create(req.body);
    res.status(201).json(doc);
  } catch(e){
    if (e.code === 11000) return res.status(409).json({message:'Timesheet for that date already exists.'});
    res.status(400).json({message:e.message});
  }
}
export async function updateTimesheet(req, res){
  try {
    const doc = await Timesheet.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    if(!doc) return res.status(404).json({message:'Not found'});
    res.json(doc);
  } catch(e){ res.status(400).json({message:e.message}); }
}
export async function deleteTimesheet(req, res){
  const doc = await Timesheet.findByIdAndDelete(req.params.id);
  if(!doc) return res.status(404).json({message:'Not found'});
  res.json({ok:true});
}
