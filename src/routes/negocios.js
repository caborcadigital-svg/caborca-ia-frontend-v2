const express = require('express');
const axios = require('axios');
const { supabase } = require('../../config/supabase');
const { logger } = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { categoria, limit = 20, page = 1, q, destacados } = req.query;
    let query = supabase
      .from('negocios')
      .select('*')
      .eq('activo', true)
      .order('destacado', { ascending: false })
      .order('nombre')
      .range((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit) - 1);

    if (categoria) query = query.eq('categoria', categoria);
    if (destacados === 'true') query = query.eq('destacado', true);
    if (q) query = query.or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%,categoria.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) throw error;

    if ((!data || data.length === 0) && q && process.env.GOOGLE_PLACES_API_KEY) {
      const places = await buscarGooglePlaces(q);
      return res.json(places);
    }

    res.json(data || []);
  } catch (err) {
    logger.error('Error negocios:', err.message);
    res.status(500).json({ error: 'Error obteniendo negocios' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('id', req.params.id)
      .eq('activo', true)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Negocio no encontrado' });
    res.json(data);
  } catch { res.status(500).json({ error: 'Error obteniendo negocio' }); }
});

async function buscarGooglePlaces(query) {
  try {
    const res = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: { query: `${query} Caborca Sonora`, key: process.env.GOOGLE_PLACES_API_KEY, language: 'es' },
    });
    return res.data.results.slice(0, 5).map(p => ({
      id: p.place_id, nombre: p.name, direccion: p.formatted_address,
      categoria: p.types?.[0] || 'negocio', rating: p.rating, fuente: 'google_places',
    }));
  } catch (err) {
    logger.error('Error Google Places:', err.message);
    return [];
  }
}

module.exports = router;
