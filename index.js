
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const requestApiKey = req.headers['x-api-key'];
  
  // Skip authentication if no API key is configured or it's empty
  if (!apiKey || apiKey === '') {
    console.log('API key authentication is disabled');
    return next();
  }
  
  if (!requestApiKey) {
    return res.status(401).json({ error: 'Unauthorized: Missing API key' });
  }
  
  if (requestApiKey !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MCP Server is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Tool endpoints
app.post('/api/tools/:toolName', authenticateApiKey, (req, res) => {
  const { toolName } = req.params;
  const params = req.body;
  
  console.log(`Tool "${toolName}" called with params:`, params);
  
  // Example tool response
  switch(toolName.toLowerCase()) {
    case 'weather':
      res.json({ 
        result: `Weather information for ${params.location || 'unknown location'}`,
        temperature: Math.floor(Math.random() * 30) + 5
      });
      break;
    case 'search':
      res.json({ 
        result: `Search results for: ${params.query || 'unknown query'}`,
        sources: ['Example Source 1', 'Example Source 2']
      });
      break;
    default:
      res.json({ 
        result: `Tool "${toolName}" executed with parameters: ${JSON.stringify(params)}`
      });
  }
});

// Start server
app.listen(port, () => {
  console.log(`MCP Server listening on port ${port}`);
  console.log(`API Key authentication: ${apiKey ? 'enabled' : 'disabled'}`);
});
