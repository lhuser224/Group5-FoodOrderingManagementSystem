const db = require('../config/db');

const Food = {
  findAll: async (filters = {}) => {
    let query = 'SELECT * FROM foods WHERE 1=1';
    const params = [];

    const status = filters.status || 'available';
    query += ' AND status = ?';
    params.push(status);

    if (filters.shopId) { query += ' AND shop_id = ?'; params.push(filters.shopId); }
    if (filters.categoryId) { query += ' AND category_id = ?'; params.push(filters.categoryId); }
    
    if (filters.search) { 
      query += ' AND name LIKE ?'; 
      params.push(`%${filters.search}%`); 
    }

    if (filters.minPrice) { query += ' AND price >= ?'; params.push(filters.minPrice); }
    if (filters.maxPrice) { query += ' AND price <= ?'; params.push(filters.maxPrice); }

    if (filters.sortBy === 'price_asc') query += ' ORDER BY price ASC';
    else if (filters.sortBy === 'price_desc') query += ' ORDER BY price DESC';
    else query += ' ORDER BY id DESC';

    const limit = Number(filters.limit) || 10;
    const offset = ((Number(filters.page) || 1) - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByIdWithOptions: async (id) => {
    const [foods] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (!foods[0]) return null;
    const [groups] = await db.query(
      `SELECT og.* FROM option_groups og
       JOIN food_option_assignments fo ON og.id = fo.group_id
       WHERE fo.food_id = ?`, [id]
    );
    for (let group of groups) {
      const [items] = await db.query(
        'SELECT * FROM option_items WHERE group_id = ? AND is_available = true',
        [group.id]
      );
      group.items = items;
    }
    return { ...foods[0], option_groups: groups };
  },

  create: async (data) => {
    const { name, price, image_url, shop_id, category_id } = data;
    const [res] = await db.query(
      'INSERT INTO foods (name, price, image_url, shop_id, category_id, status) VALUES (?, ?, ?, ?, ?, "available")',
      [name, price, image_url || '', shop_id, category_id || null]
    );
    return Food.findById(res.insertId);
  },

  update: async (id, data) => {
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    if (!fields) return Food.findById(id);
    await db.query(`UPDATE foods SET ${fields} WHERE id = ?`, [...Object.values(data), id]);
    return Food.findById(id);
  },

  delete: async (id) => {
    await db.query('UPDATE foods SET status = "hidden" WHERE id = ?', [id]);
    return { id };
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE foods SET status = ? WHERE id = ?', [status, id]);
    return Food.findById(id);
  }
};

module.exports = Food;