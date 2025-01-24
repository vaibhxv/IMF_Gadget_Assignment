import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { generateCodename } from '../utils/codename.js';

const router = Router();

const GadgetSchema = z.object({
  status: z.enum(['Available', 'Deployed', 'Destroyed', 'Decommissioned']),
});

router.get('/', async (req, res) => {
  try {
    let query = supabase.from('gadgets').select('id, codename, status');
    
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    
    const { data: gadgets, error } = await query;
    
    if (error) throw error;
    
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 41) + 60 // 60-100%
    }));
    
    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const codename = generateCodename();
    
    const { data: gadget, error } = await supabase
      .from('gadgets')
      .insert({
        codename,
        created_by: req.auth.sub
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(gadget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const validatedData = GadgetSchema.partial().parse(req.body);
    
    const { data: gadget, error } = await supabase
      .from('gadgets')
      .update(validatedData)
      .eq('id', req.params.id)
      .eq('created_by', req.auth.sub)
      .select()
      .single();
    
    if (error) throw error;
    if (!gadget) return res.status(404).json({ error: 'Gadget not found' });
    
    res.json(gadget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { data: gadget, error } = await supabase
      .from('gadgets')
      .update({
        status: 'Decommissioned',
        decommissioned_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('created_by', req.auth.sub)
      .select()
      .single();
    
    if (error) throw error;
    if (!gadget) return res.status(404).json({ error: 'Gadget not found' });
    
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/:id/self-destruct', async (req, res) => {
  try {
   
       
    const { data: gadget, error } = await supabase
      .from('gadgets')
      .update({ status: 'Destroyed' })
      .eq('id', req.params.id)
      .eq('created_by', req.auth.sub)
      .select()
      .single();
    
    if (error) throw error;
    if (!gadget) return res.status(404).json({ error: 'Gadget not found' });
    
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as gadgetRoutes };