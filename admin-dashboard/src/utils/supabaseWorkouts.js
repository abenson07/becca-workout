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

/**
 * Fetch all workouts for a specific trainer
 * @param {string} trainerId - The ID of the trainer
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const fetchWorkoutsByTrainerId = async (trainerId) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error fetching workouts by trainer ID:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Group workouts by client ID
 * @param {Array} workouts - Array of workout objects
 * @returns {Object} Object with client_id as keys and arrays of workouts as values
 */
export const groupWorkoutsByClient = (workouts) => {
  const grouped = {};
  
  workouts.forEach(workout => {
    const clientId = workout.client_id;
    if (!grouped[clientId]) {
      grouped[clientId] = [];
    }
    grouped[clientId].push(workout);
  });

  // Sort client groups alphanumerically by client_id
  const sortedGrouped = {};
  Object.keys(grouped)
    .sort()
    .forEach(clientId => {
      sortedGrouped[clientId] = grouped[clientId];
    });

  return sortedGrouped;
}; 

/**
 * Create a new workout
 * @param {Object} workoutData - The workout data including name, trainer_id, and client_id
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const createWorkout = async (workoutData) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workoutData)
      .select()
      .single();

    if (error) {
      throw error;
    }

      return { success: true, data };
} catch (err) {
  console.error('Error creating workout:', err);
  return { success: false, error: err.message };
}
};

/**
 * Update an existing workout
 * @param {string} workoutId - The ID of the workout to update
 * @param {Object} updateData - The workout data to update
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const updateWorkout = async (workoutId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .update(updateData)
      .eq('id', workoutId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error updating workout:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Delete a workout
 * @param {string} workoutId - The ID of the workout to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteWorkout = async (workoutId) => {
  try {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting workout:', err);
    return { success: false, error: err.message };
  }
}; 