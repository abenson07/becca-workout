import { supabase } from '../supabaseClient';

export const fetchTrainersData = async () => {
  try {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching trainers:', err);
    throw err;
  }
};

export const fetchTrainerById = async (trainerId) => {
  try {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('id', trainerId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error fetching trainer by ID:', err);
    return { success: false, error: err.message };
  }
};

export const createTrainer = async (trainerData) => {
  try {
    const { data, error } = await supabase
      .from('trainers')
      .insert(trainerData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error creating trainer:', err);
    return { success: false, error: err.message };
  }
};

export const updateTrainer = async (trainerId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('trainers')
      .update(updateData)
      .eq('id', trainerId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error updating trainer:', err);
    return { success: false, error: err.message };
  }
};

export const deleteTrainer = async (trainerId) => {
  try {
    const { error } = await supabase
      .from('trainers')
      .delete()
      .eq('id', trainerId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting trainer:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch clients associated with a specific trainer
 * @param {string} trainerId - The ID of the trainer
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const fetchClientsByTrainerId = async (trainerId) => {
  try {
    const { data, error } = await supabase
      .from('trainer_client')
      .select(`
        client_id,
        clients (
          id,
          first_name,
          last_name
        )
      `)
      .eq('trainer_id', trainerId);

    if (error) {
      throw error;
    }

    // Extract client data from the joined result
    const clients = data.map(item => item.clients).filter(Boolean);
    return { success: true, data: clients };
  } catch (err) {
    console.error('Error fetching clients by trainer ID:', err);
    return { success: false, error: err.message };
  }
};

export const getTrainersColumns = (data) => {
  if (!data || data.length === 0) return [];
  
  // Get column names from the first row
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key: key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}; 