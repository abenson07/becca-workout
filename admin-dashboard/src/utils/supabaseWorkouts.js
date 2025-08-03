import { supabase } from '../supabaseClient';

/**
 * Fetch all workouts for a specific client
 * @param {string} clientId - The ID of the client
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const fetchWorkoutsByClientId = async (clientId) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error fetching workouts by client ID:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Group workouts by trainer ID
 * @param {Array} workouts - Array of workout objects
 * @returns {Object} Object with trainer_id as keys and arrays of workouts as values
 */
export const groupWorkoutsByTrainer = (workouts) => {
  const grouped = {};
  
  workouts.forEach(workout => {
    const trainerId = workout.trainer_id;
    if (!grouped[trainerId]) {
      grouped[trainerId] = [];
    }
    grouped[trainerId].push(workout);
  });

  // Sort trainer groups alphanumerically by trainer_id
  const sortedGrouped = {};
  Object.keys(grouped)
    .sort()
    .forEach(trainerId => {
      sortedGrouped[trainerId] = grouped[trainerId];
    });

  return sortedGrouped;
}; 