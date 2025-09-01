// Simple test API route for Vercel
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'Vercel API route working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: process.env.NODE_ENV || 'unknown'
  });
};