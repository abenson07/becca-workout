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

    return { success: true, data };
  } catch (err) {
    console.error('Error fetching movement by ID:', err);
    return { success: false, error: err.message };
  }
};

export const createMovement = async (movementData) => {
  try {
    const { data, error } = await supabase
      .from('movements')
      .insert(movementData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error creating movement:', err);
    return { success: false, error: err.message };
  }
};

export const updateMovement = async (movementId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('movements')
      .update(updateData)
      .eq('id', movementId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error updating movement:', err);
    return { success: false, error: err.message };
  }
};

export const deleteMovement = async (movementId) => {
  try {
    const { error } = await supabase
      .from('movements')
      .delete()
      .eq('id', movementId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting movement:', err);
    return { success: false, error: err.message };
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