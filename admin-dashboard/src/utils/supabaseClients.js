import { supabase } from '../supabaseClient';


export const fetchClientsData = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching clients:', err);
    throw err;
  }
};

export const getClientsColumns = (data) => {
  if (!data || data.length === 0) return [];
  
  // Get column names from the first row
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key: key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}; 