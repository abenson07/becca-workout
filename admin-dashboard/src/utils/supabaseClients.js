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

export const fetchClientById = async (clientId) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching client by ID:', err);
    throw err;
  }
};

export const createClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error creating client:', err);
    return { success: false, error: err.message };
  }
};

export const updateClient = async (clientId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error updating client:', err);
    return { success: false, error: err.message };
  }
};

export const deleteClient = async (clientId) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting client:', err);
    return { success: false, error: err.message };
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