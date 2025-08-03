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

    return data;
  } catch (err) {
    console.error('Error fetching trainer by ID:', err);
    throw err;
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

export const getTrainersColumns = (data) => {
  if (!data || data.length === 0) return [];
  
  // Get column names from the first row
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key: key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}; 