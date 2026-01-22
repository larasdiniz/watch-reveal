const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const NodeCache = require('node-cache');

const app = express();

// IMPORTANTE: Configure CORS para produção
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// CORS configurado corretamente - REMOVIDO o app.options('*') que causava erro
app.use(cors(corsOptions));
app.use(express.json());

// Cache com tempo de vida de 60 segundos
const cache = new NodeCache({ stdTTL: 60 });

// Configuração do cliente
const getClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wAvsXV5O1ijY@ep-jolly-bush-ahjlnxsy-pooler.c-3.us-east-1.aws.neon.tech/neondb',
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    connectionTimeoutMillis: 10000, // Timeout de 10 segundos
  });
};

// Middleware para log
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as time');
    await client.end();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database_time: result.rows[0].time
    });
    
  } catch (error) {
    console.error('Health check error:', error.message);
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Teste básico
app.get('/api/test', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const result = await client.query('SELECT id, name, price FROM watches LIMIT 3');
    await client.end();
    
    res.json({
      success: true,
      count: result.rows.length,
      watches: result.rows
    });
    
  } catch (error) {
    console.error('Test error:', error);
    await client.end().catch(() => {});
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

// Rota para TODOS os relógios com filtros
app.get('/api/watches', async (req, res) => {
  const cacheKey = `watches_${JSON.stringify(req.query)}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return res.json(cachedData);
  }
  
  const client = getClient();
  
  try {
    await client.connect();
    const { category, minPrice, maxPrice, search, sortBy, limit } = req.query;
    
    let query = `
      SELECT 
        w.*,
        ARRAY_AGG(DISTINCT wc.color_hex) as colors,
        ARRAY_AGG(DISTINCT wf.feature) as features
      FROM watches w
      LEFT JOIN watch_colors wc ON w.id = wc.watch_id
      LEFT JOIN watch_features wf ON w.id = wf.watch_id
    `;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (category && category !== 'Todos') {
      conditions.push(`w.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    
    if (minPrice) {
      conditions.push(`w.price >= $${paramIndex}`);
      params.push(parseInt(minPrice));
      paramIndex++;
    }
    
    if (maxPrice) {
      conditions.push(`w.price <= $${paramIndex}`);
      params.push(parseInt(maxPrice));
      paramIndex++;
    }
    
    if (search) {
      conditions.push(`w.name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY w.id ';
    
    // Ordenação
    switch(sortBy) {
      case 'price-low':
        query += ' ORDER BY w.price ASC';
        break;
      case 'price-high':
        query += ' ORDER BY w.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY w.rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY w.created_at DESC';
        break;
      default:
        query += ' ORDER BY w.id ASC';
    }
    
    // Limite
    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }
    
    const result = await client.query(query, params);
    await client.end();
    
    const watches = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      original_price: row.original_price,
      rating: parseFloat(row.rating),
      reviews: row.reviews,
      image_url: row.image_url,
      colors: row.colors ? row.colors.filter(c => c !== null) : [],
      features: row.features ? row.features.filter(f => f !== null) : [],
      is_new: row.is_new,
      is_limited: row.is_limited,
      created_at: row.created_at
    }));
    
    cache.set(cacheKey, watches);
    res.json(watches);
    
  } catch (error) {
    console.error('Database error:', error);
    await client.end().catch(() => {});
    res.status(500).json({ 
      error: 'Failed to fetch watches',
      details: error.message
    });
  }
});

// ROTA ESPECÍFICA: Comparação
app.get('/api/watches/compare', async (req, res) => {
  const cacheKey = 'compare_watches';
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return res.json(cachedData);
  }
  
  const client = getClient();
  
  try {
    await client.connect();
    
    const query = `
      SELECT 
        w.*,
        ARRAY_AGG(DISTINCT wc.color_hex) as colors,
        ARRAY_AGG(DISTINCT wf.feature) as features
      FROM watches w
      LEFT JOIN watch_colors wc ON w.id = wc.watch_id
      LEFT JOIN watch_features wf ON w.id = wf.watch_id
      GROUP BY w.id
      ORDER BY w.price DESC
      LIMIT 2
    `;
    
    const result = await client.query(query);
    await client.end();
    
    const watches = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      original_price: row.original_price,
      rating: parseFloat(row.rating),
      reviews: row.reviews,
      image_url: row.image_url,
      colors: row.colors ? row.colors.filter(c => c !== null) : [],
      features: row.features ? row.features.filter(f => f !== null) : [],
      is_new: row.is_new,
      is_limited: row.is_limited,
      created_at: row.created_at
    }));
    
    cache.set(cacheKey, watches);
    res.json(watches);
    
  } catch (error) {
    console.error('Database error:', error);
    await client.end().catch(() => {});
    
    // Fallback data para evitar que o frontend fique travado
    const fallbackData = [
      {
        id: 1,
        name: "ChronoElite Classic",
        category: "Clássico",
        price: 24900,
        original_price: 29900,
        rating: 4.9,
        reviews: 128,
        image_url: "/assets/watch-hero.png",
        colors: ["#0F172A", "#92400E", "#1E40AF"],
        features: ["Automático", "Aço 316L", "Cristal Safira"],
        is_new: true,
        is_limited: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "ChronoElite Gold",
        category: "Premium",
        price: 48900,
        original_price: null,
        rating: 5.0,
        reviews: 64,
        image_url: "/assets/watch-model3.png",
        colors: ["#B45309", "#78350F", "#F59E0B"],
        features: ["Ouro 18K", "Edição Limitada", "Automático"],
        is_new: false,
        is_limited: true,
        created_at: new Date().toISOString()
      }
    ];
    
    cache.set(cacheKey, fallbackData, 10); // Cache menor para fallback
    res.json(fallbackData);
  }
});

// ROTA ESPECÍFICA: Relógio em destaque
app.get('/api/watches/featured', async (req, res) => {
  const cacheKey = 'featured_watch';
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return res.json(cachedData);
  }
  
  const client = getClient();
  
  try {
    await client.connect();
    
    const query = `
      SELECT 
        w.*,
        ARRAY_AGG(DISTINCT wc.color_hex) as colors,
        ARRAY_AGG(DISTINCT wf.feature) as features,
        JSON_AGG(
          DISTINCT jsonb_build_object(
            'type', wi.image_type,
            'url', wi.image_url,
            'order', wi.display_order
          )
        ) as images
      FROM watches w
      LEFT JOIN watch_colors wc ON w.id = wc.watch_id
      LEFT JOIN watch_features wf ON w.id = wf.watch_id
      LEFT JOIN watch_images wi ON w.id = wi.watch_id
      WHERE w.id = 1
      GROUP BY w.id
    `;
    
    const result = await client.query(query);
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum relógio em destaque encontrado' });
    }
    
    const row = result.rows[0];
    const watch = processWatchData(row);
    
    cache.set(cacheKey, watch);
    res.json(watch);
    
  } catch (error) {
    console.error('Database error:', error);
    await client.end().catch(() => {});
    
    // Fallback data
    const fallbackData = {
      id: 1,
      name: "ChronoElite Classic",
      category: "Clássico",
      price: 24900,
      original_price: 29900,
      rating: 4.9,
      reviews: 128,
      image_url: "/assets/watch-hero.png",
      colors: ["#0F172A", "#92400E", "#1E40AF"],
      features: ["Automático", "Aço 316L", "Cristal Safira"],
      images: {
        main: "/assets/watch-hero.png",
        details: ["/assets/watch-detail.png"],
        straps: ["/assets/watch-strap.png"],
        gallery: ["/assets/watch-hero.png", "/assets/watch-detail.png", "/assets/watch-strap.png"]
      },
      is_new: true,
      is_limited: false,
      created_at: new Date().toISOString()
    };
    
    cache.set(cacheKey, fallbackData, 10);
    res.json(fallbackData);
  }
});

// ROTA DINÂMICA: Relógio por ID (ATUALIZADA)
app.get('/api/watches/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `watch_${id}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return res.json(cachedData);
  }
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  
  const client = getClient();
  
  try {
    await client.connect();
    
    const query = `
      SELECT 
        w.*,
        ARRAY_AGG(DISTINCT wc.color_hex) as colors,
        ARRAY_AGG(DISTINCT wf.feature) as features,
        COALESCE(
          JSON_AGG(
            DISTINCT jsonb_build_object(
              'type', wi.image_type,
              'url', wi.image_url,
              'order', COALESCE(wi.display_order, 0)
            )
          ) FILTER (WHERE wi.image_url IS NOT NULL),
          '[]'
        ) as images
      FROM watches w
      LEFT JOIN watch_colors wc ON w.id = wc.watch_id
      LEFT JOIN watch_features wf ON w.id = wf.watch_id
      LEFT JOIN watch_images wi ON w.id = wi.watch_id
      WHERE w.id = $1
      GROUP BY w.id
    `;
    
    const result = await client.query(query, [id]);
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relógio não encontrado' });
    }
    
    const row = result.rows[0];
    const watch = processWatchData(row);
    
    cache.set(cacheKey, watch);
    res.json(watch);
    
  } catch (error) {
    console.error('Database error:', error);
    await client.end().catch(() => {});
    res.status(500).json({ 
      error: 'Failed to fetch watch',
      details: error.message
    });
  }
});

// Função auxiliar para processar dados do watch
function processWatchData(row) {
  // Processar imagens
  const images = row.images ? row.images.filter(img => img.url !== null) : [];
  
  // Obter imagem principal (ou usar a default da tabela watches)
  const mainImageObj = images.find(img => img.type === 'main');
  const mainImage = mainImageObj ? mainImageObj.url : row.image_url;
  
  // Agrupar imagens por tipo
  const detailImages = images
    .filter(img => img.type === 'detail')
    .sort((a, b) => a.order - b.order)
    .map(img => img.url);
  
  const strapImages = images
    .filter(img => img.type === 'strap')
    .sort((a, b) => a.order - b.order)
    .map(img => img.url);
  
  // Criar galeria com todas as imagens únicas
  const allImageUrls = [mainImage, ...detailImages, ...strapImages];
  const gallery = [...new Set(allImageUrls.filter(url => url))];
  
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    original_price: row.original_price,
    rating: parseFloat(row.rating),
    reviews: row.reviews,
    image_url: mainImage,
    images: {
      main: mainImage,
      details: detailImages,
      straps: strapImages,
      gallery: gallery
    },
    colors: row.colors ? row.colors.filter(c => c !== null) : [],
    features: row.features ? row.features.filter(f => f !== null) : [],
    is_new: row.is_new,
    is_limited: row.is_limited,
    created_at: row.created_at
  };
}

// Rota para requisições OPTIONS (CORS) - FORA do middleware principal
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Rota para qualquer outra requisição não encontrada
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    available_routes: [
      '/api/health',
      '/api/test',
      '/api/watches',
      '/api/watches/compare',
      '/api/watches/featured',
      '/api/watches/:id'
    ]
  });
});

// IMPORTANTE: Mude de 3001 para 10000 aqui ↓
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});