const mongoose = require('mongoose');

const TargetModelService = {
    validateTarget: async (id, type) => {
        // Check if ID is syntactically valid (prevents CastError)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { 
                isValid: false, 
                message: `Invalid ID format for ${type}` 
            };
        }
        // Get the model dynamically
        const Model = mongoose.model(type);
        if (!Model) {
            return { isValid: false, message: "Invalid target type provided" };
        }
        // Check database existence
        const exists = await Model.exists({ _id: id });
        if (!exists) {
            return { 
                isValid: false, 
                message: `${type} with ID ${id} does not exist.` 
            };
        }
        return { isValid: true };
    }
};

module.exports = TargetModelService;