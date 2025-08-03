import { supabase } from '../supabaseClient';

export const fetchMovementsData = async () => {
  try {
    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching movements:', err);
    throw err;
  }
};

export const fetchMovementById = async (movementId) => {
  try {
    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .eq('id', movementId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching movement by ID:', err);
    throw err;
  }
};

export const getMovementsColumns = (data) => {
  if (!data || data.length === 0) return [];
  
  // Get column names from the first row
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key: key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}; 