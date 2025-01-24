import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    
    const { data: { user }, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password
    });
    
    if (error) throw error;
    
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    });
    
    if (error) throw error;
    
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes };