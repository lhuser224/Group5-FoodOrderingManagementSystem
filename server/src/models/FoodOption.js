const db = require('../config/db');

const FoodOption = {
  assignGroupToFood: async (food_id, group_id) => {
    await db.query('INSERT INTO food_option_assignments (food_id, group_id) VALUES (?, ?)', [food_id, group_id]);
    return true;
  },

  getGroupsWithItems: async (foodId) => {
    const [groups] = await db.query(
      `SELECT og.* FROM option_groups og 
       JOIN food_option_assignments fo ON og.id = fo.group_id 
       WHERE fo.food_id = ?`, [foodId]
    );

    return Promise.all(groups.map(async (group) => {
      const [items] = await db.query('SELECT * FROM option_items WHERE group_id = ? AND is_available = true', [group.id]);
      return { ...group, items };
    }));
  }
};

module.exports = FoodOption;