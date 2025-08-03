// Configuration for different entity types
export const entityConfigs = {
  client: {
    title: 'Edit Client',
    addTitle: 'Add New Client',
    fields: [
      { 
        key: 'first_name', 
        label: 'First Name', 
        type: 'text', 
        required: true,
        placeholder: 'Enter first name'
      },
      { 
        key: 'last_name', 
        label: 'Last Name', 
        type: 'text', 
        required: true,
        placeholder: 'Enter last name'
      },
      { 
        key: 'email', 
        label: 'Email', 
        type: 'email', 
        required: true,
        placeholder: 'Enter email address'
      },
      { 
        key: 'date_of_birth', 
        label: 'Date of Birth', 
        type: 'date'
      },
      { 
        key: 'training_goals', 
        label: 'Training Goals', 
        type: 'textarea',
        placeholder: 'Enter training goals and objectives'
      },
      { 
        key: 'injury_notes', 
        label: 'Injury Notes', 
        type: 'textarea',
        placeholder: 'Enter any injury history or notes'
      },
      { 
        key: 'profile_picture_url', 
        label: 'Profile Picture', 
        type: 'file'
      }
    ]
  },
  
  trainer: {
    title: 'Edit Trainer',
    addTitle: 'Add New Trainer',
    fields: [
      { 
        key: 'first_name', 
        label: 'First Name', 
        type: 'text', 
        required: true,
        placeholder: 'Enter first name'
      },
      { 
        key: 'last_name', 
        label: 'Last Name', 
        type: 'text', 
        required: true,
        placeholder: 'Enter last name'
      },
      { 
        key: 'email', 
        label: 'Email', 
        type: 'email', 
        required: true,
        placeholder: 'Enter email address'
      },
      { 
        key: 'date_of_birth', 
        label: 'Date of Birth', 
        type: 'date'
      },
      { 
        key: 'specialties', 
        label: 'Specialties', 
        type: 'text',
        placeholder: 'Enter specialties (comma-separated)'
      },
      { 
        key: 'bio', 
        label: 'Bio', 
        type: 'textarea',
        placeholder: 'Enter trainer bio'
      },
      { 
        key: 'certifications', 
        label: 'Certifications', 
        type: 'textarea',
        placeholder: 'Enter certifications and qualifications'
      },
      { 
        key: 'profile_picture_url', 
        label: 'Profile Picture', 
        type: 'file'
      }
    ]
  },
  
  movement: {
    title: 'Edit Movement',
    addTitle: 'Add New Movement',
    fields: [
      { 
        key: 'name', 
        label: 'Movement Name', 
        type: 'text', 
        required: true,
        placeholder: 'Enter movement name'
      },
      { 
        key: 'type', 
        label: 'Type', 
        type: 'select',
        options: [
          { value: 'strength', label: 'Strength' },
          { value: 'cardio', label: 'Cardio' },
          { value: 'flexibility', label: 'Flexibility' },
          { value: 'balance', label: 'Balance' },
          { value: 'functional', label: 'Functional' }
        ]
      },
      { 
        key: 'category', 
        label: 'Category', 
        type: 'select',
        options: [
          { value: 'upper_body', label: 'Upper Body' },
          { value: 'lower_body', label: 'Lower Body' },
          { value: 'full_body', label: 'Full Body' },
          { value: 'core', label: 'Core' },
          { value: 'cardio', label: 'Cardio' }
        ]
      },
      { 
        key: 'equipment', 
        label: 'Equipment Required', 
        type: 'text',
        placeholder: 'Enter required equipment'
      },
      { 
        key: 'primary_muscle', 
        label: 'Primary Muscle Group', 
        type: 'text',
        placeholder: 'Enter primary muscle group'
      },
      { 
        key: 'secondary_muscle', 
        label: 'Secondary Muscle Group', 
        type: 'text',
        placeholder: 'Enter secondary muscle group'
      },
      { 
        key: 'description', 
        label: 'Description', 
        type: 'textarea',
        placeholder: 'Enter movement description'
      },
      { 
        key: 'instructions', 
        label: 'Instructions', 
        type: 'textarea',
        placeholder: 'Enter movement instructions'
      },
      { 
        key: 'profile_picture_url', 
        label: 'Movement Image', 
        type: 'file'
      }
    ]
  }
};

// Helper function to get config for an entity
export const getEntityConfig = (entityType, isAdd = false) => {
  const config = entityConfigs[entityType];
  if (!config) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }
  
  return {
    ...config,
    title: isAdd ? config.addTitle : config.title
  };
}; 