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

export const getTrainersColumns = (data) => {
  if (!data || data.length === 0) return [];
  
  // Get column names from the first row
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key: key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}; 